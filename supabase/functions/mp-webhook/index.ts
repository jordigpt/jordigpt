// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Manejo de CORS (necesario si pruebas desde navegador, aunque MP llama directo)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    // Mercado Pago puede enviar el ID por query param 'id' o 'data.id' en el body
    const queryId = url.searchParams.get("id") || url.searchParams.get("data.id");
    
    let paymentId = queryId;
    
    // Si no está en la URL, revisamos el body (es lo estándar hoy en día)
    if (!paymentId) {
        try {
            const body = await req.json();
            // El formato suele ser { action: 'payment.created', data: { id: '123' }, type: 'payment' }
            if (body.data && body.data.id) {
                paymentId = body.data.id;
            } else if (body.type === 'payment' && body.data.id) { // Formato antiguo/alternativo
                paymentId = body.data.id;
            }
        } catch (e) {
            // Si falla el parseo del body, seguimos intentando con lo que tengamos
            console.warn("No body or invalid json", e);
        }
    }

    if (!paymentId) {
        // Respondemos 200 aunque no procesemos, para que MP deje de spamear
        return new Response(JSON.stringify({ message: "No payment ID found, skipping" }), { status: 200, headers: corsHeaders });
    }

    // 1. Consultar a Mercado Pago el estado REAL del pago
    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN');
    if (!mpAccessToken) throw new Error('MP_ACCESS_TOKEN not defined');

    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
            'Authorization': `Bearer ${mpAccessToken}`
        }
    });

    if (!mpResponse.ok) {
        throw new Error(`Error fetching payment from MP: ${mpResponse.statusText}`);
    }

    const paymentData = await mpResponse.json();

    // 2. Verificar si está aprobado
    if (paymentData.status === 'approved') {
        const externalReference = paymentData.external_reference;

        if (!externalReference) {
            console.error("Pago aprobado sin external_reference. No se puede vincular a orden.");
            return new Response(JSON.stringify({ message: "Missing external_reference" }), { status: 200 });
        }

        // 3. Actualizar la base de datos
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Actualizamos todas las órdenes que tengan este "external_reference" 
        // (Usamos la columna mp_preference_id para guardar esta referencia única)
        const { error: updateError } = await supabaseAdmin
            .from('orders')
            .update({ 
                status: 'approved',
                payment_id: String(paymentId),
                updated_at: new Date().toISOString()
            })
            .eq('mp_preference_id', externalReference); // Aquí es donde ocurre la magia del vínculo

        if (updateError) {
            console.error("Error updating order:", updateError);
            throw updateError;
        }
        
        console.log(`Orden ${externalReference} aprobada exitosamente.`);
    }

    return new Response(JSON.stringify({ message: "Webhook processed" }), { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error("Webhook Error:", error);
    // IMPORTANTE: Devolver 200 o MP reintentará infinitamente. Loggeamos el error internamente.
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 200, // Respondemos OK para que MP no reintente si es un error lógico nuestro
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
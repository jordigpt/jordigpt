// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PAYPAL_API = Deno.env.get('PAYPAL_ENV') === 'sandbox' 
  ? 'https://api-m.sandbox.paypal.com' 
  : 'https://api-m.paypal.com';

// Helper para obtener token de PayPal
async function getPayPalAccessToken() {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID');
  const clientSecret = Deno.env.get('PAYPAL_SECRET');
  
  if (!clientId || !clientSecret) throw new Error("Missing PayPal Credentials");

  const auth = btoa(`${clientId}:${clientSecret}`);
  
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { action, cartItems, orderID } = await req.json();
    const accessToken = await getPayPalAccessToken();

    // --- ACCIÓN 1: CREAR ORDEN ---
    if (action === 'create') {
        // 1. Validar productos y calcular total en servidor
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        const { data: products } = await supabaseClient
            .from('products')
            .select('id, price, title')
            .in('id', cartItems);

        if (!products || products.length === 0) throw new Error("No products found");

        const totalValue = products.reduce((sum, item) => sum + Number(item.price), 0);

        // 2. Crear orden en PayPal
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: totalValue.toFixed(2)
                    },
                    description: `Compra JordiGPT: ${products.length} items`
                }]
            })
        });

        const orderData = await response.json();
        return new Response(JSON.stringify({ id: orderData.id }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // --- ACCIÓN 2: CAPTURAR PAGO Y DAR ACCESO ---
    if (action === 'capture') {
        // 1. Capturar fondos en PayPal
        const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const captureData = await response.json();
        
        // Verificar si fue exitoso (COMPLETED)
        if (captureData.status === 'COMPLETED') {
            const supabaseAdmin = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            );

            // Obtener usuario
            const { data: { user } } = await supabaseAdmin.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', ''));
            if (!user) throw new Error("User not found");

            // Recuperar qué productos eran (se podría pasar de nuevo o guardar estado, 
            // pero por seguridad recalculamos ids basados en el request original del frontend)
            // Asumimos que el frontend manda cartItems de nuevo para saber qué insertar.
            
            const { data: products } = await supabaseAdmin
                .from('products')
                .select('id, price')
                .in('id', cartItems);

            // Insertar Órdenes en Supabase
            const ordersToInsert = products.map(p => ({
                user_id: user.id,
                product_id: p.id,
                amount: p.price,
                status: 'approved',
                provider: 'paypal',
                payment_id: orderID
            }));

            const { error: insertError } = await supabaseAdmin.from('orders').insert(ordersToInsert);
            if (insertError) throw insertError;

            return new Response(JSON.stringify({ status: 'success' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        } else {
             throw new Error("PayPal Capture Failed: " + captureData.status);
        }
    }

    throw new Error("Invalid Action");

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
})
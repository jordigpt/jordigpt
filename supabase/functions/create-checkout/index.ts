// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { productId, cartItems } = await req.json()
    
    let productIds: string[] = [];
    if (cartItems && Array.isArray(cartItems)) {
        productIds = cartItems;
    } else if (productId) {
        productIds = [productId];
    } else {
        throw new Error("No products provided");
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: products, error: productError } = await supabaseClient
      .from('products')
      .select('*')
      .in('id', productIds)

    if (productError || !products || products.length === 0) {
      throw new Error('Productos no encontrados')
    }

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN')
    if (!mpAccessToken) {
      throw new Error('Falta configuración de Mercado Pago (MP_ACCESS_TOKEN)')
    }

    const mpItems = products.map(p => ({
        id: p.id,
        title: p.title,
        description: p.short_description ? p.short_description.substring(0, 250) : p.title,
        unit_price: Number(p.price),
        quantity: 1,
        currency_id: "USD",
        picture_url: p.image_url
    }));

    const paidItems = mpItems.filter(i => i.unit_price > 0);

    if (paidItems.length === 0) {
         throw new Error('El carrito solo contiene productos gratuitos o inválidos.');
    }

    // --- MAGIA DEL WEBHOOK ---
    // 1. Generamos un ID único para ESTA transacción (nuestro ID de referencia)
    const uniqueReferenceId = crypto.randomUUID();
    
    // 2. Construimos la URL del webhook dinámicamente según tu proyecto
    // (Obtiene el ID del proyecto de la variable de entorno URL)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const projectUrl = supabaseUrl.replace(/\/$/, ''); // Quitar slash final si existe
    const webhookUrl = `${projectUrl}/functions/v1/mp-webhook`;

    console.log("Configurando webhook a:", webhookUrl);

    const preferenceData = {
      items: paidItems,
      back_urls: {
        success: `${req.headers.get('origin')}/payment/success`,
        failure: `${req.headers.get('origin')}/payment/failure`,
        pending: `${req.headers.get('origin')}/payment/pending`
      },
      auto_return: "approved",
      // 3. Enviamos nuestra referencia y la URL de notificación
      external_reference: uniqueReferenceId,
      notification_url: webhookUrl, 
      statement_descriptor: "JORDIGPT",
    }

    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mpAccessToken}`
      },
      body: JSON.stringify(preferenceData)
    })

    const mpData = await mpResponse.json()

    if (mpData.status === 400 || mpData.error) {
        console.error("MP Error:", mpData)
        throw new Error('Error creando preferencia en Mercado Pago: ' + (mpData.message || JSON.stringify(mpData)))
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 4. Guardamos las órdenes usando uniqueReferenceId en la columna mp_preference_id
    // Esto nos permite encontrar estas filas cuando el webhook nos devuelva el external_reference
    const ordersToInsert = products.map(p => ({
        user_id: user ? user.id : null,
        product_id: p.id,
        amount: p.price,
        mp_preference_id: uniqueReferenceId, // Guardamos NUESTRA referencia, no la de MP
        status: 'pending'
    }));

    await supabaseAdmin.from('orders').insert(ordersToInsert)

    return new Response(
      JSON.stringify({ url: mpData.init_point, sandbox_url: mpData.sandbox_init_point }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
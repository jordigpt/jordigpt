// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Aceptamos productId (legacy/single buy) o cartItems (array de IDs)
    const { productId, cartItems } = await req.json()
    
    // Normalizar a un array de IDs
    let productIds: string[] = [];
    if (cartItems && Array.isArray(cartItems)) {
        productIds = cartItems;
    } else if (productId) {
        productIds = [productId];
    } else {
        throw new Error("No products provided");
    }

    // 1. Inicializar Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // 2. Obtener productos de la base de datos (seguridad de precio)
    const { data: products, error: productError } = await supabaseClient
      .from('products')
      .select('*')
      .in('id', productIds)

    if (productError || !products || products.length === 0) {
      throw new Error('Productos no encontrados')
    }

    // 3. Obtener el usuario (opcional, si está logueado)
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    // 4. Configurar Mercado Pago
    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN')
    if (!mpAccessToken) {
      throw new Error('Falta configuración de Mercado Pago (MP_ACCESS_TOKEN)')
    }

    // 5. Crear items para la preferencia de MP
    const mpItems = products.map(p => ({
        id: p.id,
        title: p.title,
        description: p.short_description ? p.short_description.substring(0, 250) : p.title,
        unit_price: Number(p.price),
        quantity: 1,
        currency_id: "USD",
        picture_url: p.image_url
    }));

    // Filtrar items gratuitos si se colaron (aunque el front debería manejarlos)
    const paidItems = mpItems.filter(i => i.unit_price > 0);

    if (paidItems.length === 0) {
         throw new Error('El carrito solo contiene productos gratuitos o inválidos.');
    }

    const preferenceData = {
      items: paidItems,
      back_urls: {
        success: `${req.headers.get('origin')}/payment/success`,
        failure: `${req.headers.get('origin')}/payment/failure`,
        pending: `${req.headers.get('origin')}/payment/pending`
      },
      auto_return: "approved",
      external_reference: user ? user.id : "guest",
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

    // 6. Guardar las órdenes en nuestra base de datos (una por producto)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const ordersToInsert = products.map(p => ({
        user_id: user ? user.id : null,
        product_id: p.id,
        amount: p.price,
        mp_preference_id: mpData.id,
        status: 'pending'
    }));

    await supabaseAdmin.from('orders').insert(ordersToInsert)

    // 7. Retornar la URL de pago
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
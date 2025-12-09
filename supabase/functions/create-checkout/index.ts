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
    const { productId } = await req.json()
    
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

    // 2. Obtener el producto de la base de datos para asegurar el precio
    const { data: product, error: productError } = await supabaseClient
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      throw new Error('Producto no encontrado')
    }

    if (product.price <= 0) {
        throw new Error('Este producto es gratuito, no requiere pago.')
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

    // 5. Crear la preferencia en Mercado Pago
    const preferenceData = {
      items: [
        {
          id: product.id,
          title: product.title,
          description: product.short_description ? product.short_description.substring(0, 250) : product.title,
          unit_price: Number(product.price),
          quantity: 1,
          currency_id: "USD",
          picture_url: product.image_url
        }
      ],
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

    // 6. Guardar la orden en nuestra base de datos
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabaseAdmin.from('orders').insert({
      user_id: user ? user.id : null,
      product_id: product.id,
      amount: product.price,
      mp_preference_id: mpData.id,
      status: 'pending'
    })

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
// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderRecord {
  id: string
  user_id: string
  product_id: string
  amount: number
  status: string
  created_at: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    // El payload del webhook viene como { type: 'INSERT' | 'UPDATE', record: { ... }, old_record: { ... } }
    // O si se llama directo via API, vendrá el body directo.
    const order: OrderRecord = payload.record || payload

    if (!order || !order.user_id || !order.product_id) {
        throw new Error("Invalid order data")
    }

    // Solo enviamos email si la orden está aprobada
    if (order.status !== 'approved') {
        return new Response(JSON.stringify({ message: "Order not approved, skipping email." }), { headers: corsHeaders })
    }

    // Inicializar Supabase Admin (para leer users y products)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Obtener Email del Usuario
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.getUserById(order.user_id)
    
    if (userError || !user || !user.email) {
        throw new Error("Could not find user email")
    }

    // 2. Obtener Detalles del Producto
    const { data: product, error: prodError } = await supabaseAdmin
        .from('products')
        .select('title, price')
        .eq('id', order.product_id)
        .single()

    if (prodError || !product) {
        throw new Error("Could not find product details")
    }

    // 3. Enviar Email con Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'JordiGPT System <onboarding@resend.dev>', // O tu dominio verificado si tienes uno
        to: [user.email],
        subject: `Confirmación de Acceso: ${product.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
               <h1 style="color: #d4e83a; margin: 0; font-size: 24px;">JORDI<span style="color: #fff">GPT</span></h1>
            </div>
            
            <h2 style="font-size: 20px; margin-bottom: 20px;">¡Acceso Confirmado!</h2>
            
            <p style="color: #ccc; line-height: 1.6;">
              Tu compra de <strong>${product.title}</strong> se ha procesado correctamente.
              Ya tienes acceso inmediato a todo el material en tu panel de control.
            </p>

            <div style="background: #111; padding: 15px; border-left: 4px solid #d4e83a; margin: 20px 0;">
               <p style="margin: 0; color: #fff;"><strong>Producto:</strong> ${product.title}</p>
               <p style="margin: 5px 0 0; color: #888;">Precio: US$ ${order.amount}</p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="https://jordigpt.com/account" style="background-color: #d4e83a; color: #000; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                IR A MI ARSENAL
              </a>
            </div>

            <hr style="border: 0; border-top: 1px solid #333; margin: 30px 0;" />
            
            <p style="font-size: 12px; color: #666; text-align: center;">
              Si tienes dudas, responde a este correo.<br/>
              © ${new Date().getFullYear()} JordiGPT System
            </p>
          </div>
        `,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
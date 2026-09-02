import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.99.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

const value = (input: unknown, limit: number) => typeof input === 'string' ? input.trim().slice(0, limit) : ''

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed.' }), { status: 405, headers: corsHeaders })

  try {
    const body = await request.json()
    if (value(body.website, 200)) return new Response(JSON.stringify({ ok: true }), { headers: corsHeaders })

    const fullName = value(body.fullName, 120)
    const phone = value(body.phone, 40)
    const email = value(body.email, 254).toLowerCase()
    const projectType = value(body.projectType, 80)
    const message = value(body.message, 4000)
    if (!fullName || !phone || !email.includes('@') || !message) {
      return new Response(JSON.stringify({ error: 'Please complete every required field.' }), { status: 400, headers: corsHeaders })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { error } = await supabase.from('contact_requests').insert({ full_name: fullName, phone, email, project_type: projectType || null, message })
    if (error) throw error
    return new Response(JSON.stringify({ ok: true }), { status: 201, headers: corsHeaders })
  } catch (error) {
    console.error('apply-contact failed', error)
    return new Response(JSON.stringify({ error: 'We could not send your message. Please call us instead.' }), { status: 500, headers: corsHeaders })
  }
})

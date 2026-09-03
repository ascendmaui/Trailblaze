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
    const email = value(body.email, 254).toLowerCase()
    const phone = value(body.phone, 40)
    const roleAppliedFor = value(body.roleAppliedFor, 100)
    const availability = value(body.availability, 160)
    const experience = value(body.experience, 4000)
    const motivation = value(body.motivation, 4000)
    const yearsExperience = Math.max(0, Math.min(80, Number.parseInt(String(body.yearsExperience), 10) || 0))
    if (!fullName || !email.includes('@') || !phone || !roleAppliedFor || !experience || !motivation) {
      return new Response(JSON.stringify({ error: 'Please complete every required field.' }), { status: 400, headers: corsHeaders })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: application, error } = await supabase
      .from('career_applications')
      .insert({ full_name: fullName, email, phone, role_applied_for: roleAppliedFor, years_experience: yearsExperience, availability: availability || null, experience, motivation, status: 'interview_ready' })
      .select('id, interview_token')
      .single()
    if (error) throw error

    const { data: owners } = await supabase.from('profiles').select('id').in('role', ['platform_admin', 'owner', 'manager']).eq('active', true)
    if (owners?.length) {
      await supabase.from('notifications').insert(owners.map((owner) => ({ recipient_id: owner.id, category: 'hiring', title: 'New career application', body: `${fullName} applied for ${roleAppliedFor}.` })))
    }
    return new Response(JSON.stringify({ ok: true, applicationId: application.id, interviewToken: application.interview_token }), { status: 201, headers: corsHeaders })
  } catch (error) {
    console.error('submit-application failed', error)
    return new Response(JSON.stringify({ error: 'We could not submit your application. Please try again.' }), { status: 500, headers: corsHeaders })
  }
})

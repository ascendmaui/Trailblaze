import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.99.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

const isUuid = (value: unknown) => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed.' }), { status: 405, headers: corsHeaders })

  try {
    const { applicationId, interviewToken } = await request.json()
    if (!isUuid(applicationId) || !isUuid(interviewToken)) {
      return new Response(JSON.stringify({ error: 'This interview link is invalid.' }), { status: 400, headers: corsHeaders })
    }

    const xaiKey = Deno.env.get('XAI_API_KEY')
    if (!xaiKey) {
      return new Response(JSON.stringify({ error: 'The voice interviewer is not configured yet. Please contact Trailblaze.' }), { status: 503, headers: corsHeaders })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: application, error } = await supabase
      .from('career_applications')
      .select('id, full_name, role_applied_for, years_experience, availability, status')
      .eq('id', applicationId)
      .eq('interview_token', interviewToken)
      .in('status', ['interview_ready', 'interview_requested'])
      .maybeSingle()
    if (error) throw error
    if (!application) return new Response(JSON.stringify({ error: 'This interview is unavailable or has already been completed.' }), { status: 404, headers: corsHeaders })

    const tokenResponse = await fetch('https://api.x.ai/v1/realtime/client_secrets', {
      method: 'POST',
      headers: { Authorization: `Bearer ${xaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ expires_after: { seconds: 300 } }),
    })
    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok || !tokenData?.value) {
      console.error('xAI client secret error', tokenData)
      return new Response(JSON.stringify({ error: 'We could not start the voice interview. Please try again.' }), { status: 502, headers: corsHeaders })
    }

    return new Response(JSON.stringify({
      token: tokenData.value,
      expiresAt: tokenData.expires_at,
      candidate: {
        firstName: application.full_name.split(/\s+/)[0] || 'there',
        role: application.role_applied_for,
        yearsExperience: application.years_experience,
        availability: application.availability,
      },
    }), { headers: corsHeaders })
  } catch (error) {
    console.error('start-xai-interview failed', error)
    return new Response(JSON.stringify({ error: 'We could not start the voice interview. Please try again.' }), { status: 500, headers: corsHeaders })
  }
})
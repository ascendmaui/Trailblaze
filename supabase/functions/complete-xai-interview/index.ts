import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.99.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

const isUuid = (value: unknown) => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
const trim = (value: unknown, limit: number) => typeof value === 'string' ? value.trim().slice(0, limit) : ''

const scoreSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    score: { type: 'integer', minimum: 0, maximum: 100 },
    verdict: { type: 'string', enum: ['Strong fit', 'Potential fit', 'Needs review', 'Not a fit'] },
    summary: { type: 'string', minLength: 20, maxLength: 900 },
    strengths: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 5 },
    risks: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 5 },
  },
  required: ['score', 'verdict', 'summary', 'strengths', 'risks'],
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed.' }), { status: 405, headers: corsHeaders })

  try {
    const { applicationId, interviewToken, transcript } = await request.json()
    const cleanTranscript = trim(transcript, 16000)
    if (!isUuid(applicationId) || !isUuid(interviewToken) || cleanTranscript.length < 80) {
      return new Response(JSON.stringify({ error: 'Please complete the voice interview before submitting it.' }), { status: 400, headers: corsHeaders })
    }

    const xaiKey = Deno.env.get('XAI_API_KEY')
    if (!xaiKey) return new Response(JSON.stringify({ error: 'The voice interviewer is not configured yet. Please contact Trailblaze.' }), { status: 503, headers: corsHeaders })

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: application, error } = await supabase
      .from('career_applications')
      .select('id, full_name, role_applied_for, years_experience, availability, experience, motivation, status')
      .eq('id', applicationId)
      .eq('interview_token', interviewToken)
      .in('status', ['interview_ready', 'interview_requested'])
      .maybeSingle()
    if (error) throw error
    if (!application) return new Response(JSON.stringify({ error: 'This interview is unavailable or has already been completed.' }), { status: 404, headers: corsHeaders })

    const assessmentResponse = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${xaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'grok-4.6',
        temperature: 0.2,
        response_format: { type: 'json_schema', json_schema: { name: 'trailblaze_candidate_assessment', strict: true, schema: scoreSchema } },
        messages: [
          { role: 'system', content: 'You create fair, job-related hiring summaries for Trailblaze Construction. Evaluate only evidence relevant to the stated role: work experience, communication, reliability, safety mindset, planning, collaboration, availability, and willingness to learn. Do not infer or score protected characteristics, personality diagnoses, age, gender, race, disability, nationality, religion, family status, or any other non-job-related attribute. Treat the score as a decision-support recommendation, never an automatic hiring decision. Keep the summary concise and actionable for an owner.' },
          { role: 'user', content: `Role: ${application.role_applied_for}\nCandidate application:\n- Years of experience: ${application.years_experience}\n- Availability: ${application.availability || 'Not provided'}\n- Relevant experience: ${application.experience}\n- Motivation: ${application.motivation}\n\nVoice interview transcript (candidate speech only):\n${cleanTranscript}` },
        ],
      }),
    })
    const assessmentData = await assessmentResponse.json()
    const content = assessmentData?.choices?.[0]?.message?.content
    if (!assessmentResponse.ok || typeof content !== 'string') {
      console.error('xAI assessment error', assessmentData)
      return new Response(JSON.stringify({ error: 'We received the interview but could not generate its scorecard. Please try again.' }), { status: 502, headers: corsHeaders })
    }

    const assessment = JSON.parse(content)
    const score = Math.max(0, Math.min(100, Number.parseInt(String(assessment.score), 10) || 0))
    const strengths = Array.isArray(assessment.strengths) ? assessment.strengths.map((item: unknown) => trim(item, 240)).filter(Boolean).slice(0, 5) : []
    const risks = Array.isArray(assessment.risks) ? assessment.risks.map((item: unknown) => trim(item, 240)).filter(Boolean).slice(0, 5) : []
    if (!trim(assessment.verdict, 80) || !trim(assessment.summary, 900) || !strengths.length || !risks.length) throw new Error('Invalid assessment payload')

    const { error: transcriptError } = await supabase.from('interview_answers').upsert({
      application_id: application.id,
      question_index: 1,
      question: 'xAI voice interview transcript',
      answer: cleanTranscript,
    }, { onConflict: 'application_id,question_index' })
    if (transcriptError) throw transcriptError

    const { error: assessmentError } = await supabase.from('interview_assessments').upsert({
      application_id: application.id,
      score,
      verdict: trim(assessment.verdict, 80),
      summary: trim(assessment.summary, 900),
      strengths,
      risks,
      model: assessmentData.model || 'grok-4.6',
      input_tokens: assessmentData?.usage?.prompt_tokens || null,
      output_tokens: assessmentData?.usage?.completion_tokens || null,
    }, { onConflict: 'application_id' })
    if (assessmentError) throw assessmentError

    const { error: updateError } = await supabase.from('career_applications').update({ status: 'interview_complete' }).eq('id', application.id)
    if (updateError) throw updateError

    const { data: owners } = await supabase.from('profiles').select('id').in('role', ['owner', 'manager']).eq('active', true)
    if (owners?.length) await supabase.from('notifications').insert(owners.map((owner) => ({ recipient_id: owner.id, category: 'hiring', title: 'Voice interview complete', body: `${application.full_name}'s ${application.role_applied_for} interview is ready for review.` })))

    return new Response(JSON.stringify({ ok: true, assessment: { score, verdict: trim(assessment.verdict, 80), summary: trim(assessment.summary, 900) } }), { headers: corsHeaders })
  } catch (error) {
    console.error('complete-xai-interview failed', error)
    return new Response(JSON.stringify({ error: 'We could not complete this interview. Please try again.' }), { status: 500, headers: corsHeaders })
  }
})
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://lzgspisoetjggifgaobg.supabase.co'
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_A-JIRTxQZ88HuirZqs4sXw_xMBQVct8'

export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})

export const functionError = (error, fallback) => error?.context?.json?.().then((body) => body.error || fallback).catch(() => fallback) || fallback

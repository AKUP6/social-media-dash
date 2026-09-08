import { createClient } from '@supabase/supabase-js'

// Client-side Vite SPA, no backend — same story as callClaudeModel.js's key
// handling. The anon key is safe to ship in the bundle; it's scoped by the
// RLS policies in supabase/schema.sql, not kept secret.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = url && anonKey ? createClient(url, anonKey) : null

export const isSupabaseConfigured = Boolean(supabase)

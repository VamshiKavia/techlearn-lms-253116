import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Returns a singleton Supabase client configured from env vars.
 * Requires the orchestrator to set:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_KEY
 *
 * Auth config:
 * - autoRefreshToken: keep the session fresh
 * - persistSession: store session in localStorage
 * - detectSessionInUrl: handle magic link callbacks (safe to keep enabled)
 */
let supabaseSingleton = null;
export function getSupabaseClient() {
  if (!supabaseSingleton) {
    const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
    const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || '';
    supabaseSingleton = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }
  return supabaseSingleton;
}

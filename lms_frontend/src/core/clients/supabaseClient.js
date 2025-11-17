import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_KEY || '';

/**
 * PUBLIC_INTERFACE
 * getSupabaseClient: Returns a singleton Supabase client configured from env vars.
 * Note: Do not hardcode secrets. Ensure env variables are provided at runtime.
 */
let supabaseSingleton = null;
export function getSupabaseClient() {
  if (!supabaseSingleton) {
    supabaseSingleton = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      }
    });
  }
  return supabaseSingleton;
}

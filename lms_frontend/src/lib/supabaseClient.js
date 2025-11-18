import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Returns a singleton Supabase client configured from environment variables.
 *
 * Environment variables (injected at build/runtime by orchestrator):
 * - REACT_APP_SUPABASE_URL: Supabase project URL
 * - REACT_APP_SUPABASE_KEY: Supabase anon public key
 *
 * Behavior:
 * - Does not throw if env vars are missing; instead logs a console warning.
 * - Uses auth settings for auto-refresh & session persistence.
 */
let supabaseSingleton = null;

// PUBLIC_INTERFACE
export function getSupabaseClient() {
  if (!supabaseSingleton) {
    const url = process.env.REACT_APP_SUPABASE_URL || '';
    const key = process.env.REACT_APP_SUPABASE_KEY || '';

    // Soft validation with console warnings (no secrets logged)
    if (!url || !key) {
      // Intentionally avoid logging any values
      console.warn(
        '[Supabase] Missing environment variables. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY to enable Supabase features.'
      );
    }

    supabaseSingleton = createClient(url, key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseSingleton;
}

/**
 * PUBLIC_INTERFACE
 * checkSupabaseHealth
 * Performs a minimal connectivity check to Supabase by calling getSession().
 * This avoids exposing secrets and is safe to run in development.
 *
 * Returns:
 *  - { ok: boolean, message?: string }
 */
export async function checkSupabaseHealth() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      return { ok: false, message: error.message || 'auth.getSession failed' };
    }
    // If no error, we likely reached the API successfully (even if there's no session)
    return { ok: true, message: data?.session ? 'Session active' : 'No session (ok)' };
  } catch (e) {
    return { ok: false, message: e?.message || 'Unknown error' };
  }
}

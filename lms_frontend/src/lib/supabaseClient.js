import { createClient } from '@supabase/supabase-js';

/**
 * Resolve Supabase URL/KEY from Vite or CRA environments without leaking secrets.
 */
function resolveSupabaseEnv() {
  // Prefer Vite env first, then CRA fallback
  const vite = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  const url =
    (vite && (vite.VITE_SUPABASE_URL || vite.VITE_PUBLIC_SUPABASE_URL)) ||
    (typeof process !== 'undefined' && process.env && (process.env.REACT_APP_SUPABASE_URL || process.env.REACT_APP_PUBLIC_SUPABASE_URL)) ||
    '';
  const key =
    (vite && (vite.VITE_SUPABASE_KEY || vite.VITE_PUBLIC_SUPABASE_KEY || vite.VITE_SUPABASE_ANON_KEY)) ||
    (typeof process !== 'undefined' && process.env && (process.env.REACT_APP_SUPABASE_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY)) ||
    '';
  return { url: String(url || ''), key: String(key || '') };
}

/**
 * Log a non-sensitive diagnostic for env presence.
 */
function logEnvPresenceSafe() {
  try {
    const { url, key } = resolveSupabaseEnv();
    // eslint-disable-next-line no-console
    console.info('Supabase env resolver', {
      mode: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE) || process.env?.NODE_ENV || 'development',
      urlPresent: !!url,
      keyPresent: !!key,
    });
  } catch {
    // no-op
  }
}
logEnvPresenceSafe();

let client = null;
const { url: SB_URL, key: SB_KEY } = resolveSupabaseEnv();
if (SB_URL && SB_KEY) {
  client = createClient(SB_URL, SB_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

/**
 * PUBLIC_INTERFACE
 * getSupabaseOrNull - returns initialized Supabase client or null if env missing.
 */
export function getSupabaseOrNull() {
  /** Returns Supabase client if configured; otherwise null. */
  return client;
}

/**
 * PUBLIC_INTERFACE
 * getSupabaseEnvDiagnostics - lightweight info for UI diagnostics.
 */
export function getSupabaseEnvDiagnostics() {
  /** Returns non-sensitive booleans about env presence. */
  const { url, key } = resolveSupabaseEnv();
  return { urlPresent: !!url, keyPresent: !!key };
}

/**
 * Default export: Supabase client (may be null if not configured).
 */
export default client;

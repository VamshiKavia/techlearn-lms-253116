/**
 * JS shim to re-export TS supabase client.
 * Logs a non-sensitive info line about env mode resolution and masked env presence.
 *
 * Note: This is the only import path JS/JSX files should use in CRA:
 *   import supabase, { getSupabaseEnvDiagnostics, getSupabaseOrNull } from '../lib/supabaseClient.js';
 */
// Safe, non-secret diagnostics at module init
(function logEnvPresence() {
  try {
    const url = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SUPABASE_URL) || '';
    const key = (typeof process !== 'undefined' && process.env && process.env.REACT_APP_SUPABASE_KEY) || '';
    const urlLen = url ? String(url).length : 0;
    const keyLen = key ? String(key).length : 0;
    // eslint-disable-next-line no-console
    console.info('Supabase env resolver', {
      envMode: 'REACT_APP',
      urlPresent: !!url,
      keyPresent: !!key,
      urlLen,
      keyLen: keyLen > 0 ? 'set' : 0, // avoid leaking exact length if desired
    });
  } catch {
    // no-op
  }
})();

export { default } from './supabaseClient.ts';
export * from './supabaseClient.ts';

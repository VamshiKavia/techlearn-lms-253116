import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Resolve environment variables for both Vite (import.meta.env.VITE_*)
 * and CRA (process.env.REACT_APP_*) builds. Prefer Vite if available.
 */
function resolveEnv() {
  // Using optional chaining to avoid runtime errors when import.meta isn't present in CRA.
  const viteEnv = (typeof import.meta !== 'undefined' && (import.meta as any)?.env) || {};
  const viteUrl = (viteEnv?.VITE_SUPABASE_URL as string | undefined)?.trim();
  const viteKey = (viteEnv?.VITE_SUPABASE_KEY as string | undefined)?.trim();
  const viteSiteUrl = (viteEnv?.VITE_SITE_URL as string | undefined)?.trim();

  const craUrl = (typeof process !== 'undefined' ? process.env?.REACT_APP_SUPABASE_URL : undefined) as string | undefined;
  const craKey = (typeof process !== 'undefined' ? process.env?.REACT_APP_SUPABASE_KEY : undefined) as string | undefined;
  const craSiteUrl = (typeof process !== 'undefined' ? process.env?.REACT_APP_SITE_URL : undefined) as string | undefined;

  const url = (viteUrl || craUrl || '').trim();
  const key = (viteKey || craKey || '').trim();
  const siteUrl =
    (viteSiteUrl || craSiteUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')).trim();

  const envOrigin =
    viteUrl || viteKey || viteSiteUrl
      ? 'Vite'
      : craUrl || craKey || craSiteUrl
      ? 'CRA'
      : 'unknown';

  return { url, key, siteUrl, envOrigin };
}

const { url: SUPABASE_URL, key: SUPABASE_KEY, siteUrl: SITE_URL, envOrigin } = resolveEnv();

/**
 * Derive a normalized origin string for diagnostics and redirectTo.
 */
function safeOriginFrom(urlLike: string): string {
  try {
    return new URL(urlLike, urlLike).origin;
  } catch {
    if (typeof window !== 'undefined') return window.location.origin;
    return 'http://localhost:3000';
  }
}

// Safe diagnostics: do not leak secrets. Only log which env set is used and the redirect origin and basic validity.
(function safeStartupLog() {
  try {
    const mode =
      (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.MODE) ||
      (typeof process !== 'undefined' && process.env?.NODE_ENV) ||
      '';
    const isTest = String(mode).toLowerCase() === 'test';
    const isDev =
      (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
      (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.DEV);

    if (typeof window !== 'undefined' && !isTest) {
      const urlOk = !!SUPABASE_URL && /^https?:\/\//.test(SUPABASE_URL.trim());
      const keyOk = !!SUPABASE_KEY && SUPABASE_KEY.trim().length > 20;
      const diag = {
        envOrigin,
        supabaseUrl_present: !!SUPABASE_URL,
        supabaseKey_present: !!SUPABASE_KEY,
        supabaseUrl_valid: urlOk,
        siteOrigin: safeOriginFrom(SITE_URL),
      };
      // eslint-disable-next-line no-console
      console.info('Supabase client init', diag);
      if (isDev && (!urlOk || !keyOk)) {
        // eslint-disable-next-line no-console
        console.warn(
          'Supabase config may be invalid: ensure VITE_SUPABASE_URL/VITE_SUPABASE_KEY (preferred) or REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_KEY are set and valid.'
        );
      }
    }
  } catch {
    // no-op
  }
})();

// Keep a single instance
let _client: SupabaseClient | null = null;

/** PUBLIC_INTERFACE: Supabase client singleton for the application.
 * Provides a single shared SupabaseClient instance configured from env.
 */
export const supabase: SupabaseClient = (() => {
  if (!_client) {
    _client = createClient(SUPABASE_URL || '', SUPABASE_KEY || '', {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return _client!;
})();

/** PUBLIC_INTERFACE
 * getEmailRedirectTo
 * Returns the origin to be used for Supabase auth email redirects.
 */
export function getEmailRedirectTo(): string {
  return safeOriginFrom(SITE_URL);
}

/** PUBLIC_INTERFACE
 * getSupabaseEnvDiagnostics
 * Returns human-safe diagnostics about Supabase config for UI surfacing.
 */
export function getSupabaseEnvDiagnostics(): {
  envOrigin: string;
  urlPresent: boolean;
  keyPresent: boolean;
  urlValid: boolean;
  siteOrigin: string;
} {
  return {
    envOrigin,
    urlPresent: !!SUPABASE_URL,
    keyPresent: !!SUPABASE_KEY,
    urlValid: !!SUPABASE_URL && /^https?:\/\//.test(SUPABASE_URL.trim()),
    siteOrigin: safeOriginFrom(SITE_URL),
  };
}

// Also export a default for consumers that prefer default import style
export default supabase;

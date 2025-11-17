import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * CRA-only environment resolution for Supabase.
 * Reads REACT_APP_* variables and ignores any Vite/import.meta.env values.
 */
function resolveCRAEnv() {
  const url = ((typeof process !== 'undefined' ? process.env?.REACT_APP_SUPABASE_URL : undefined) as string | undefined)?.trim() || '';
  const key = ((typeof process !== 'undefined' ? process.env?.REACT_APP_SUPABASE_KEY : undefined) as string | undefined)?.trim() || '';
  const siteUrl =
    ((typeof process !== 'undefined' ? process.env?.REACT_APP_SITE_URL : undefined) as string | undefined)?.trim() ||
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  return { url, key, siteUrl };
}

const { url: SUPABASE_URL, key: SUPABASE_KEY, siteUrl: SITE_URL } = resolveCRAEnv();
const ENV_MODE = 'REACT_APP';

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

// Safe diagnostics: do not leak secrets. Only log CRA mode and basic validity.
(function safeStartupLog() {
  try {
    const isTest = String((typeof process !== 'undefined' && process.env?.NODE_ENV) || '').toLowerCase() === 'test';
    const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';

    if (typeof window !== 'undefined' && !isTest) {
      const urlOk = !!SUPABASE_URL && /^https?:\/\//.test(SUPABASE_URL.trim());
      const keyOk = !!SUPABASE_KEY && SUPABASE_KEY.trim().length > 0;
      const diag = {
        envMode: ENV_MODE,
        supabaseUrl_present: !!SUPABASE_URL,
        supabaseKey_present: !!SUPABASE_KEY,
        supabaseUrl_valid: urlOk,
        siteOrigin: safeOriginFrom(SITE_URL),
      };
      // eslint-disable-next-line no-console
      console.info('Supabase client init', diag);
      if (isDev && (!urlOk || !keyOk)) {
        // eslint-disable-next-line no-console
        console.warn('Supabase config may be invalid: ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY are set.');
      }
    }
  } catch {
    // no-op
  }
})();

// Keep a single instance
let _client: SupabaseClient | null = null;

/**
 * PUBLIC_INTERFACE
 * Supabase client singleton for the application (CRA-only env).
 * Throws a clear error if REACT_APP_SUPABASE_URL is missing/empty.
 */
export const supabase: SupabaseClient = (() => {
  if (!_client) {
    const url = SUPABASE_URL || '';
    const key = SUPABASE_KEY || '';
    if (!url) {
      throw new Error(
        'Supabase configuration error: REACT_APP_SUPABASE_URL is required but was not provided. Set it in your environment.'
      );
    }
    _client = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return _client!;
})();

/**
 * PUBLIC_INTERFACE
 * getEmailRedirectTo
 * Returns the origin to be used for Supabase auth email redirects.
 */
export function getEmailRedirectTo(): string {
  return safeOriginFrom(SITE_URL);
}

/**
 * PUBLIC_INTERFACE
 * getSupabaseEnvDiagnostics
 * Returns human-safe diagnostics about Supabase config for UI surfacing.
 */
export function getSupabaseEnvDiagnostics(): {
  envMode: 'REACT_APP';
  url: string | null; // masked to origin only for safety
  urlValid: boolean;
  keyPresent: boolean;
} {
  // mask URL to its origin only
  const maskedUrl = (() => {
    try {
      return SUPABASE_URL ? new URL(SUPABASE_URL).origin : null;
    } catch {
      return SUPABASE_URL || null;
    }
  })();

  const urlValid = !!SUPABASE_URL && /^https?:\/\//.test(SUPABASE_URL.trim());
  const keyPresent = !!SUPABASE_KEY && SUPABASE_KEY.trim().length > 0;

  return {
    envMode: 'REACT_APP',
    url: maskedUrl,
    urlValid,
    keyPresent,
  };
}

// Also export a default for consumers that prefer default import style
export default supabase;

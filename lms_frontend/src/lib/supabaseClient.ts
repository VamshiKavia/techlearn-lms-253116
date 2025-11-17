import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * CRA-only environment resolution for Supabase.
 * Reads REACT_APP_* variables and ignores any Vite/import.meta.env values.
 */
function resolveCRAEnv() {
  const url =
    ((typeof process !== 'undefined' ? (process.env as any)?.REACT_APP_SUPABASE_URL : undefined) as string | undefined)?.trim() ||
    '';
  const key =
    ((typeof process !== 'undefined' ? (process.env as any)?.REACT_APP_SUPABASE_KEY : undefined) as string | undefined)?.trim() ||
    '';
  const siteUrl =
    ((typeof process !== 'undefined' ? (process.env as any)?.REACT_APP_SITE_URL : undefined) as string | undefined)?.trim() ||
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
    const isTest = String((typeof process !== 'undefined' && (process.env as any)?.NODE_ENV) || '')
      .toLowerCase()
      .includes('test');
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
      if (!urlOk || !keyOk) {
        // eslint-disable-next-line no-console
        console.warn(
          'Supabase config may be invalid: ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY are set in lms_frontend/.env, then restart.'
        );
      }
    }
  } catch {
    // no-op
  }
})();

// Keep a single instance and a captured init error (if any)
let _client: SupabaseClient | null = null;
let _initError: Error | null = null;

/**
 * Initialize the supabase client if possible, capturing init error instead of throwing.
 */
function initClientIfPossible() {
  if (_client || _initError) return;
  const url = SUPABASE_URL || '';
  const key = SUPABASE_KEY || '';
  if (!url) {
    _initError = new Error(
      'Supabase configuration error: REACT_APP_SUPABASE_URL is missing. Add it to lms_frontend/.env and restart the dev server.'
    );
    _client = null;
    return;
  }
  try {
    _client = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (e: any) {
    _initError = e instanceof Error ? e : new Error(String(e ?? 'Unknown Supabase init error'));
    _client = null;
  }
}

/**
 * PUBLIC_INTERFACE
 * Supabase client singleton for the application (CRA-only env).
 * Backwards-compatible default export. May throw if accessed when URL is missing.
 */
export const supabase: SupabaseClient = (() => {
  initClientIfPossible();
  if (_client) return _client;
  // keep legacy behavior for code that directly imports `supabase`
  throw _initError || new Error('Supabase is not configured.');
})();

/**
 * PUBLIC_INTERFACE
 * getSupabaseOrNull
 * Returns the supabase client if configured; otherwise null (no throw).
 */
export function getSupabaseOrNull(): SupabaseClient | null {
  initClientIfPossible();
  return _client;
}

/**
 * PUBLIC_INTERFACE
 * getSupabaseInitError
 * Returns the initialization error if client could not be created (e.g., URL missing); otherwise null.
 */
export function getSupabaseInitError(): Error | null {
  initClientIfPossible();
  return _initError;
}

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

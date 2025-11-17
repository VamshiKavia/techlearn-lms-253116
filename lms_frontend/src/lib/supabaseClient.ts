import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Resolve environment variables for both Vite (import.meta.env.VITE_*)
 * and CRA (process.env.REACT_APP_*) builds. Prefer Vite if available.
 */
function resolveEnv() {
  // Using optional chaining to avoid runtime errors when import.meta isn't present in CRA.
  const viteEnv = (typeof import.meta !== 'undefined' && (import.meta as any)?.env) || {};
  const viteUrl = viteEnv?.VITE_SUPABASE_URL as string | undefined;
  const viteKey = viteEnv?.VITE_SUPABASE_KEY as string | undefined;
  const viteSiteUrl = viteEnv?.VITE_SITE_URL as string | undefined;

  const craUrl = (typeof process !== 'undefined' ? process.env?.REACT_APP_SUPABASE_URL : undefined) as string | undefined;
  const craKey = (typeof process !== 'undefined' ? process.env?.REACT_APP_SUPABASE_KEY : undefined) as string | undefined;
  const craSiteUrl = (typeof process !== 'undefined' ? process.env?.REACT_APP_SITE_URL : undefined) as string | undefined;

  const url = viteUrl || craUrl || '';
  const key = viteKey || craKey || '';
  const siteUrl =
    viteSiteUrl ||
    craSiteUrl ||
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

  const envOrigin =
    viteUrl || viteKey || viteSiteUrl
      ? 'Vite'
      : craUrl || craKey || craSiteUrl
      ? 'CRA'
      : 'unknown';

  return { url, key, siteUrl, envOrigin };
}

const { url: SUPABASE_URL, key: SUPABASE_KEY, siteUrl: SITE_URL, envOrigin } = resolveEnv();

// Safe diagnostics: do not leak secrets. Only log which env set is used and the redirect origin.
(function safeStartupLog() {
  try {
    const isTest = String(
      (typeof process !== 'undefined' && process.env?.NODE_ENV) ||
        ((typeof import.meta !== 'undefined' && (import.meta as any)?.env?.MODE) as string) ||
        ''
    ).toLowerCase() === 'test';

    if (typeof window !== 'undefined' && !isTest) {
      // eslint-disable-next-line no-console
      console.info(
        `Supabase client initialized (env=${envOrigin}, emailRedirectOrigin=${new URL(
          SITE_URL,
          SITE_URL
        ).origin})`
      );
      const isDev =
        (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
        (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.DEV);
      if (isDev && (!SUPABASE_URL || !SUPABASE_KEY)) {
        // eslint-disable-next-line no-console
        console.warn(
          'Supabase config incomplete: set VITE_SUPABASE_URL/VITE_SUPABASE_KEY (preferred) or REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_KEY.'
        );
      }
    }
  } catch {
    // no-op
  }
})();

// Keep a single instance
let _client: SupabaseClient | null = null;

// PUBLIC_INTERFACE
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

// PUBLIC_INTERFACE
export function getEmailRedirectTo(): string {
  /** Returns the origin to be used for Supabase auth email redirects. */
  try {
    // Ensure we return a clean origin (avoid trailing paths)
    return new URL(SITE_URL, SITE_URL).origin;
  } catch {
    // Fallbacks
    if (typeof window !== 'undefined') return window.location.origin;
    return 'http://localhost:3000';
  }
}

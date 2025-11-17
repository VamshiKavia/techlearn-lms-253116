import { createClient } from "@supabase/supabase-js";

/**
 * Create a singleton Supabase client using environment variables.
 * Supports both Vite (VITE_*) and CRA (REACT_APP_*) env names.
 * Logs a safe diagnostic of the Supabase URL origin in development.
 */
const VITE = (import.meta as any)?.env || {};
const SUPABASE_URL: string | undefined =
  VITE?.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY: string | undefined =
  VITE?.VITE_SUPABASE_KEY || process.env.REACT_APP_SUPABASE_KEY;

declare global {
  // eslint-disable-next-line no-var
  var __SUPABASE_CLIENT__: ReturnType<typeof createClient> | undefined;
}

function safeLogOnce() {
  if (typeof window === "undefined") return;
  const hasLogged = (window as any).__SB_LOGGED__;
  if (hasLogged) return;
  (window as any).__SB_LOGGED__ = true;
  try {
    const origin = SUPABASE_URL ? new URL(SUPABASE_URL).origin : "undefined";
    if (import.meta && (import.meta as any).env && (import.meta as any).env.DEV) {
      // eslint-disable-next-line no-console
      console.info("[auth] Supabase URL origin:", origin);
    }
  } catch {
    // ignore parsing issues
  }
}

function ensureClient() {
  if (!globalThis.__SUPABASE_CLIENT__) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      // eslint-disable-next-line no-console
      console.warn(
        "Supabase env vars not set. Please set VITE_SUPABASE_URL and VITE_SUPABASE_KEY (or CRA equivalents) in .env."
      );
    }
    globalThis.__SUPABASE_CLIENT__ = createClient(SUPABASE_URL || "", SUPABASE_KEY || "", {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    safeLogOnce();
  }
  return globalThis.__SUPABASE_CLIENT__;
}

// PUBLIC_INTERFACE
export const supabase = ensureClient();

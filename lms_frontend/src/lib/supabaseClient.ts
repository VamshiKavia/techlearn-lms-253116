import { createClient } from "@supabase/supabase-js";

/**
 * Create a singleton Supabase client using environment variables.
 * Supports both Vite (VITE_*) and CRA (REACT_APP_*) env names.
 */
const SUPABASE_URL =
  (import.meta as any)?.env?.VITE_SUPABASE_URL ||
  process.env.REACT_APP_SUPABASE_URL;

const SUPABASE_KEY =
  (import.meta as any)?.env?.VITE_SUPABASE_KEY ||
  process.env.REACT_APP_SUPABASE_KEY;

let client: ReturnType<typeof createClient> | null = null;

function ensureClient() {
  if (!client) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      // eslint-disable-next-line no-console
      console.warn(
        "Supabase env vars not set. Please set SUPABASE_URL and SUPABASE_KEY in your .env file."
      );
    }
    client = createClient(SUPABASE_URL || "", SUPABASE_KEY || "");
  }
  return client;
}

// PUBLIC_INTERFACE
export const supabase = ensureClient();

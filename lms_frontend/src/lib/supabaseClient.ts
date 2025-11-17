import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  (import.meta as any)?.env?.VITE_SUPABASE_URL ||
  process.env.REACT_APP_SUPABASE_URL;

const supabaseKey =
  (import.meta as any)?.env?.VITE_SUPABASE_KEY ||
  process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.warn("Supabase env vars not set. Set SUPABASE_URL and SUPABASE_KEY.");
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");

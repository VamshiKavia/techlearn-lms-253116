import { supabase } from "../lib/supabaseClient";

export function onAuthChange(callback: () => void) {
  const { data: subscription } = supabase.auth.onAuthStateChange((_event, _session) => {
    callback();
  });
  return () => subscription.subscription.unsubscribe();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

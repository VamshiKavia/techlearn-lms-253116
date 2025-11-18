import { useMemo } from 'react';
import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * useSupabaseClient
 * React hook that returns the singleton Supabase client instance.
 * Keeps referential stability across renders.
 */
export function useSupabaseClient() {
  const client = useMemo(() => getSupabaseClient(), []);
  return client;
}

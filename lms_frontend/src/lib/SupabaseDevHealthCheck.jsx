import { useEffect } from 'react';
import { checkSupabaseHealth } from './supabaseClient';

/**
 * PUBLIC_INTERFACE
 * SupabaseDevHealthCheck
 * In development only, performs a minimal Supabase connectivity check and logs the result to console.
 * Renders nothing visually to avoid UI changes.
 */
export function SupabaseDevHealthCheck() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    (async () => {
      const res = await checkSupabaseHealth();
      if (res.ok) {
        // Avoid logging sensitive data; only status
        // eslint-disable-next-line no-console
        console.info('[Supabase] Health check OK:', res.message);
      } else {
        // eslint-disable-next-line no-console
        console.warn('[Supabase] Health check FAILED:', res.message);
      }
    })();
  }, []);

  return null;
}

import { supabase } from './supabaseClient';

function resolveApiBase(): string {
  const viteEnv = (typeof import.meta !== 'undefined' && (import.meta as any)?.env) || {};
  const viteBase = viteEnv?.VITE_API_BASE_URL as string | undefined;
  const craBase = (typeof process !== 'undefined' ? process.env?.REACT_APP_API_BASE_URL : undefined) as
    | string
    | undefined;
  const base = viteBase || craBase || '';

  const isDev =
    (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') ||
    (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.DEV);

  if (isDev && typeof window !== 'undefined' && String(process?.env?.NODE_ENV).toLowerCase() !== 'test') {
    const envOrigin = viteBase ? 'Vite' : craBase ? 'CRA' : 'unknown';
    // eslint-disable-next-line no-console
    console.info(`API client base URL using ${envOrigin} env`);
    if (!base) {
      // eslint-disable-next-line no-console
      console.warn('API base URL not set (VITE_API_BASE_URL or REACT_APP_API_BASE_URL). Some requests may fail.');
    }
  }

  return base;
}

const BASE_URL = resolveApiBase();

// PUBLIC_INTERFACE
export const apiClient = {
  /** Perform a GET request against the configured API base URL. */
  async get(path: string, options: RequestInit = {}) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      method: 'GET',
      headers,
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
  },
};

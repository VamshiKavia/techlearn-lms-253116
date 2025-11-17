import { supabase } from './supabaseClient';

function resolveApiBase(): string {
  const craBase =
    ((typeof process !== 'undefined' ? process.env?.REACT_APP_API_BASE : undefined) as string | undefined)?.trim() ||
    ((typeof process !== 'undefined' ? process.env?.REACT_APP_BACKEND_URL : undefined) as string | undefined)?.trim() ||
    ((typeof process !== 'undefined' ? process.env?.REACT_APP_API_BASE_URL : undefined) as string | undefined)?.trim() || // backward compat
    '';
  const isDev = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';

  if (isDev && typeof window !== 'undefined' && String(process?.env?.NODE_ENV).toLowerCase() !== 'test') {
    // eslint-disable-next-line no-console
    console.info(`API client base URL using CRA env (REACT_APP_*).`);
    if (!craBase) {
      // eslint-disable-next-line no-console
      console.warn('API base URL not set. Set REACT_APP_API_BASE or REACT_APP_BACKEND_URL (or REACT_APP_API_BASE_URL).');
    }
  }

  return craBase;
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

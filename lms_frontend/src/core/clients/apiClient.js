const API_BASE = process.env.REACT_APP_API_BASE
  || process.env.REACT_APP_API_BASE_URL
  || process.env.REACT_APP_BACKEND_URL
  || '';

/**
 * PUBLIC_INTERFACE
 * apiFetch: Wrapper around fetch using environment-driven base URL.
 * @param {string} path - relative API path (e.g. '/courses')
 * @param {RequestInit} [options] - fetch options
 * @returns {Promise<Response>}
 */
export async function apiFetch(path, options = {}) {
  const base = API_BASE?.trim?.() ?? '';
  const url = base ? `${base.replace(/\/$/, '')}${path}` : path;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  return fetch(url, { ...options, headers, credentials: 'include' });
}

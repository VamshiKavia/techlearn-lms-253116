const VITE_BASE = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL) || "";
const CRA_BASE =
  (typeof process !== "undefined" && process.env && (process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_BASE)) ||
  "";
const API_BASE = (VITE_BASE || CRA_BASE || "http://localhost:3001").replace(/\/+$/, "");

// PUBLIC_INTERFACE
export async function apiGet(path, token) {
  /** Perform a GET to `${API_BASE}/api/v1${path}` with optional Bearer token. */
  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return await res.json();
}

// PUBLIC_INTERFACE
export async function apiPost(path, body, token) {
  /** Perform a POST to `${API_BASE}/api/v1${path}` with JSON body and optional Bearer token. */
  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Request failed: ${res.status} ${msg}`);
  }
  return await res.json();
}

import React from 'react';
// Import diagnostics helper from the centralized Supabase client module (JS shim for CRA resolution)
import { getSupabaseEnvDiagnostics } from '../lib/supabaseClient.js';

// PUBLIC_INTERFACE
export function EnvDiagnostics({ lastError }) {
  /** Render minimal diagnostics about Supabase env and last auth error message. */
  const diag = getSupabaseEnvDiagnostics();
  const show = process.env.NODE_ENV !== 'production';

  if (!show) return null;

  const hints = [];
  if (!diag.urlPresent || !diag.keyPresent) {
    hints.push(
      'Supabase env missing. Set VITE_SUPABASE_URL/VITE_SUPABASE_KEY (preferred) or REACT_APP_SUPABASE_URL/REACT_APP_SUPABASE_KEY.'
    );
  } else if (!diag.urlValid) {
    hints.push('Supabase URL looks invalid. Ensure it starts with https:// and has no trailing spaces.');
  }

  const lower = String(lastError || '').toLowerCase();
  if (lower.includes('not confirmed')) {
    hints.push('Your email is not confirmed. Complete email verification from Supabase and try again.');
  }
  if (lower.includes('401') || lower.includes('invalid token') || lower.includes('jwt')) {
    hints.push('Auth 401 detected. Verify the anon/public key is correct and not expired in your .env.');
  }

  return (
    <div style={{ background: '#FFF8E1', border: '1px solid #FDE68A', color: '#92400E', padding: '8px 12px', borderRadius: 6, margin: '8px 0' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Auth Diagnostics (env={diag.envOrigin})</div>
      <div style={{ fontSize: 12 }}>
        <div>siteOrigin: {diag.siteOrigin}</div>
        <div>supabaseUrlPresent: {String(diag.urlPresent)}, keyPresent: {String(diag.keyPresent)}, urlValid: {String(diag.urlValid)}</div>
        {lastError ? <div style={{ marginTop: 4 }}>Last error: {String(lastError)}</div> : null}
        {hints.length > 0 ? (
          <ul style={{ marginTop: 6, marginBottom: 0, paddingLeft: 18 }}>
            {hints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

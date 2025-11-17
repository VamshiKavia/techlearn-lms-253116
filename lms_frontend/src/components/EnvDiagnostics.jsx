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
  if (!diag.keyPresent || !diag.urlValid) {
    if (!diag.keyPresent) {
      hints.push('Supabase anon key missing. Set REACT_APP_SUPABASE_KEY in your environment.');
    }
    if (!diag.urlValid) {
      hints.push('Supabase URL missing/invalid. Set REACT_APP_SUPABASE_URL (should start with https://).');
    }
  }

  const lower = String(lastError || '').toLowerCase();
  if (lower.includes('not confirmed')) {
    hints.push('Your email is not confirmed. Complete email verification from Supabase and try again.');
  }
  if (lower.includes('401') || lower.includes('invalid token') || lower.includes('jwt')) {
    hints.push('Auth 401 detected. Verify the anon/public key is correct and not expired in your .env.');
  }
  if (lower.includes('supabase configuration error') || lower.includes('react_app_supabase_url is required')) {
    hints.push('Client init failed due to missing REACT_APP_SUPABASE_URL. Add it to your .env and rebuild.');
  }

  const showMissingUrlCallout = !diag.urlValid;

  return (
    <div style={{ background: '#FFF8E1', border: '1px solid #FDE68A', color: '#92400E', padding: '8px 12px', borderRadius: 6, margin: '8px 0' }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Auth Diagnostics (envMode={diag.envMode})</div>
      {showMissingUrlCallout && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '6px 8px', borderRadius: 6, margin: '6px 0' }}>
          Supabase URL is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in lms_frontend/.env, then restart the dev server.
        </div>
      )}
      <div style={{ fontSize: 12 }}>
        <div>supabaseUrl (masked origin): {diag.url || 'n/a'}</div>
        <div>urlValid: {String(diag.urlValid)}, keyPresent: {String(diag.keyPresent)}</div>
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

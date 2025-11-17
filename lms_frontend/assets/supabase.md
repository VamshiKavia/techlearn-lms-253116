# Supabase Integration (Frontend)

This frontend uses Supabase for authentication. No secrets are hardcoded; configuration is read from environment variables.

Environment variables (must be provided by orchestrator in `.env`):
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- REACT_APP_SITE_URL (used as emailRedirectTo for magic link / email-based flows)
- REACT_APP_API_BASE or REACT_APP_API_BASE_URL (for backend API base)
- REACT_APP_BACKEND_URL (optional fallback)

Client creation:
- src/core/clients/supabaseClient.js uses `createClient(REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY)` and enables session persistence.
- AuthContext (src/core/auth/AuthContext.jsx) wires basic session reading and signOut(). Replace role derivation with your user metadata or backend call.

Usage for sign in (to be implemented when login UI is added):
```js
const supabase = getSupabaseClient();
await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: process.env.REACT_APP_SITE_URL
  }
});
```

Security Notes:
- Do not log tokens or PII.
- Ensure the site is served over HTTPS in production.
- Configure allowed redirect URLs in Supabase project settings.


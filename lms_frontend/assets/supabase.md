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
- AuthContext (src/core/auth/AuthContext.jsx) initializes from `supabase.auth.getSession()`, subscribes to `onAuthStateChange`, and exposes `signIn(email, password)` and `signOut()`.

Email/password sign-in (current UI implementation in Login.jsx):
```js
import { getSupabaseClient } from '../core/clients/supabaseClient';

const supabase = getSupabaseClient();
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) throw error;
// data.user and data.session available; AuthContext also updates via onAuthStateChange
```

Magic link / OTP example (if needed in future):
```js
const supabase = getSupabaseClient();
await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: process.env.REACT_APP_SITE_URL // ensure this env is set
  }
});
```

Security Notes:
- Do not log tokens or PII.
- Ensure the site is served over HTTPS in production.
- Configure allowed redirect URLs in Supabase project settings.
- Ensure REACT_APP_SUPABASE_KEY is the public anon key (not service role).


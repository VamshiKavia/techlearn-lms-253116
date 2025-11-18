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
- AuthContext (src/core/auth/AuthContext.jsx) initializes from `supabase.auth.getSession()`, subscribes to `onAuthStateChange`, and exposes:
  - signIn(email, password)
  - signOut()
  - signUp(email, password, emailRedirectTo?)
  - signInWithOtp(email, emailRedirectTo?)

Email/password sign-in:
```js
import { getSupabaseClient } from '../core/clients/supabaseClient';

const supabase = getSupabaseClient();
const { data, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) throw error;
// data.user and data.session available; AuthContext also updates via onAuthStateChange
```

Sign up (email confirmation flow):
```js
const supabase = getSupabaseClient();
const emailRedirectTo = process.env.REACT_APP_SITE_URL || window.location.origin;
await supabase.auth.signUp({
  email,
  password,
  options: { emailRedirectTo }
});
```

Magic link / OTP sign-in:
```js
const supabase = getSupabaseClient();
await supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: process.env.REACT_APP_SITE_URL || window.location.origin
  }
});
```

Configuration in Supabase Dashboard:
- Go to Auth -> URL Configuration
  - Set "Site URL" to your deployed frontend (e.g., https://app.example.com)
  - Add any additional "Redirect URLs" used in development or staging
- Ensure "Email Redirects" are allowed for the above URLs

Security Notes:
- Do not log tokens or PII.
- Ensure the site is served over HTTPS in production.
- Configure allowed redirect URLs in Supabase project settings.
- Ensure REACT_APP_SUPABASE_KEY is the public anon key (not service role).
- The app emits console.warn if REACT_APP_SITE_URL is not defined; it will fallback to window.location.origin for email redirects.

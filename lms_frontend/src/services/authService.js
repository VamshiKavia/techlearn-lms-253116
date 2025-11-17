import { z } from 'zod';
import axios from 'axios';
// Import diagnostics helper from the centralized Supabase client module
// Use JS shim for stable CRA resolution
import { getSupabaseEnvDiagnostics } from '../lib/supabaseClient.js';

// Basic shapes for runtime validation
const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(['admin', 'instructor', 'student']),
});

const authResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  user: userSchema,
});

// Helper: normalize supabase error messages for user guidance
function translateSupabaseAuthError(msg = '') {
  const lower = msg.toLowerCase();
  if (lower.includes('email') && lower.includes('not confirmed')) {
    return 'Email not confirmed. Please check your inbox for the confirmation link, then try again.';
  }
  if (lower.includes('invalid login credentials')) {
    return 'Invalid login credentials. Please check your email and password.';
  }
  if (lower.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  return null;
}

// PUBLIC_INTERFACE
export function createAuthService(api) {
  /** Auth service wrapping login, signup, me endpoints with diagnostics. */
  return {
    async login(credentials) {
      try {
        // This codebase currently uses mock login; surface diagnostics instead of silent failure.
        const role = ['admin', 'instructor', 'student'].includes(credentials.role)
          ? credentials.role
          : 'student';
        const mock = {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          user: { email: credentials.email, role },
        };

        // Attempt to confirm backend token path via /api/v1/auth/debug if api is configured with Authorization
        try {
          await api.get('/auth/debug'); // will 401 without real token; we handle below silently
        } catch (e) {
          // No-op; this endpoint is for verification once real token is in place
        }

        return authResponseSchema.parse(mock);
      } catch (err) {
        const axiosErr = err && err.isAxiosError ? err : null;
        const supaMsg =
          (axiosErr?.response?.data && (axiosErr.response.data.error || axiosErr.response.data.message)) ||
          (err?.message ?? '');
        const translated = translateSupabaseAuthError(String(supaMsg));
        const diag = getSupabaseEnvDiagnostics();
        const message =
          translated ||
          `Login failed. ${supaMsg ? `Reason: ${supaMsg}` : ''} [env=${diag.envOrigin}, urlValid=${diag.urlValid}]`;
        throw new Error(message.trim());
      }
    },
    async signup(input) {
      try {
        // Mocked signup for UI; still provide diagnostics and common Supabase guidance
        const role = ['admin', 'instructor', 'student'].includes(input.role)
          ? input.role
          : 'student';
        const mock = {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh',
          user: { email: input.email, role },
        };

        // Try to call backend debug to validate CORS/origin reachability
        try {
          await axios.get('/api/v1/auth/debug');
        } catch {
          // Ignore in mock mode
        }

        return authResponseSchema.parse(mock);
      } catch (err) {
        const axiosErr = err && err.isAxiosError ? err : null;
        const supaMsg =
          (axiosErr?.response?.data && (axiosErr.response.data.error || axiosErr.response.data.message)) ||
          (err?.message ?? '');
        const translated = translateSupabaseAuthError(String(supaMsg));
        const diag = getSupabaseEnvDiagnostics();
        const message =
          translated ||
          `Signup failed. ${supaMsg ? `Reason: ${supaMsg}` : ''} [env=${diag.envOrigin}, urlValid=${diag.urlValid}]`;
        throw new Error(message.trim());
      }
    },
    async me() {
      // Implement real call when backend issues tokens; for now, throw with guidance.
      const diag = getSupabaseEnvDiagnostics();
      throw new Error(
        `Not implemented. Ensure Supabase login issues a session and call /api/v1/auth/me with bearer token. [env=${diag.envOrigin}]`
      );
    },
    // PUBLIC_INTERFACE
    userSchema,
  };
}

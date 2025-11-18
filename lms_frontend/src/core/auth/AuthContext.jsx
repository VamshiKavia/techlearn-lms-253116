import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../clients/supabaseClient';

const AuthCtx = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Provides user and session from Supabase. Persists session via supabase-js.
 * Exposes:
 *  - signIn(email, password)
 *  - signOut()
 *  - signUp(email, password, emailRedirectTo?)
 *
 * Notes:
 * - Requires env vars REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY
 * - No secrets are hardcoded.
 */
export function AuthProvider({ children }) {
  /**
   * Smoke test steps (manual):
   * 1) Start frontend (npm start) with valid REACT_APP_SUPABASE_URL/KEY.
   * 2) Visit /auth:
   *    - Sign Up tab: create a user. Expect info message to check email.
   *    - After email confirmation, go to Sign In tab and sign in.
   * 3) After successful sign-in, you should be redirected to /student/overview.
   * 4) Click Logout in topbar; expect to be sent to /login and protected routes redirect to /auth.
   */
  const supabase = getSupabaseClient();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Initialize from existing session and subscribe to changes
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;
        if (error) {
          // Fallback to null user
          setUser(null);
          setSession(null);
        } else {
          setSession(data?.session ?? null);
          setUser(data?.session?.user ?? null);
        }
      } finally {
        if (mounted) setInitializing(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, [supabase]);

  /**
   * PUBLIC_INTERFACE
   * signIn
   * Authenticate via Supabase email/password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<void>}
   */
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const err = new Error(error.message || 'Unable to sign in');
      err.code = error.status || 'AUTH_SIGNIN_FAILED';
      throw err;
    }
    // State will be updated by onAuthStateChange, but ensure immediate UI update:
    setSession(data.session);
    setUser(data.user);
  };

  /**
   * PUBLIC_INTERFACE
   * signOut
   * Signs out from Supabase and clears local state.
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      const err = new Error(error.message || 'Unable to sign out');
      err.code = error.status || 'AUTH_SIGNOUT_FAILED';
      throw err;
    }
    setSession(null);
    setUser(null);
  };

  /**
   * PUBLIC_INTERFACE
   * signUp
   * Creates an account with email/password and sends confirmation email.
   * @param {string} email
   * @param {string} password
   * @param {string} [emailRedirectTo] - If omitted, uses REACT_APP_SITE_URL or window.location.origin
   */
  const signUp = async (email, password, emailRedirectTo) => {
    const redirect = emailRedirectTo || process.env.REACT_APP_SITE_URL || window.location.origin;
    if (!process.env.REACT_APP_SITE_URL) {
      // eslint-disable-next-line no-console
      console.warn('[Auth] REACT_APP_SITE_URL is not set; using window.location.origin for email redirects:', redirect);
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirect },
    });
    if (error) {
      const err = new Error(error.message || 'Unable to sign up');
      err.code = error.status || 'AUTH_SIGNUP_FAILED';
      throw err;
    }
    return data;
  };

  const value = useMemo(
    () => ({ user, session, initializing, signIn, signOut, signUp }),
    [user, session, initializing]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useAuth
 * Access auth context
 */
export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

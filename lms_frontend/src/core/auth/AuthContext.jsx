import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../clients/supabaseClient';

const AuthCtx = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Provides user and session from Supabase. Persists session via supabase-js.
 * Exposes:
 *  - signIn(email, password, selectedRole?)
 *  - signOut()
 *  - signUp(email, password, emailRedirectTo?, selectedRole?)
 *  - setRoleInMetadata(role) — updates Supabase user_metadata.role and local fallback
 *
 * Notes:
 * - Requires env vars REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY
 * - No secrets are hardcoded.
 */
export function AuthProvider({ children }) {
  const supabase = getSupabaseClient();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(true);

  /**
   * Safely persist a role to localStorage as a fallback only.
   */
  const setLocalRole = (role) => {
    try {
      if (role) {
        localStorage.setItem('techlearn.role', role);
      } else {
        localStorage.removeItem('techlearn.role');
      }
    } catch {
      // ignore storage errors
    }
  };

  /**
   * Extract role from Supabase user metadata if present.
   */
  const getRoleFromMetadata = (u) => {
    const r =
      u?.user_metadata?.role ||
      u?.app_metadata?.role ||
      u?.identities?.[0]?.identity_data?.role ||
      null;
    if (r && ['admin', 'instructor', 'student'].includes(String(r))) {
      return String(r);
    }
    return null;
  };

  // Initialize from existing session and subscribe to changes, using metadata role as source of truth
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (!mounted) return;
        if (error) {
          setUser(null);
          setSession(null);
          setLocalRole(null);
        } else {
          const sess = data?.session ?? null;
          const u = sess?.user ?? null;
          setSession(sess);
          setUser(u);
          // On restore, prefer metadata role; fallback to keeping existing local storage if missing.
          const metaRole = getRoleFromMetadata(u);
          if (metaRole) setLocalRole(metaRole);
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
      const newUser = newSession?.user ?? null;
      setUser(newUser);
      const metaRole = getRoleFromMetadata(newUser);
      if (metaRole) setLocalRole(metaRole);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, [supabase]);

  /**
   * PUBLIC_INTERFACE
   * setRoleInMetadata
   * Update the authenticated user's role inside Supabase user_metadata and mirror to local fallback.
   * @param {'admin'|'instructor'|'student'} role
   * @returns {Promise<void>}
   */
  const setRoleInMetadata = async (role) => {
    if (!['admin', 'instructor', 'student'].includes(role)) {
      throw new Error('Invalid role');
    }
    const { error } = await supabase.auth.updateUser({
      data: { role },
    });
    if (error) {
      const err = new Error(error.message || 'Unable to update role');
      err.code = error.status || 'AUTH_ROLE_UPDATE_FAILED';
      throw err;
    }
    // Refresh local user state from Supabase to reflect updated metadata
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    } catch {
      // best-effort
    }
    setLocalRole(role);
  };

  /**
   * PUBLIC_INTERFACE
   * signIn
   * Authenticate via Supabase email/password and persist selected role into user_metadata if provided.
   * @param {string} email
   * @param {string} password
   * @param {'admin'|'instructor'|'student'} [selectedRole]
   * @returns {Promise<void>}
   */
  const signIn = async (email, password, selectedRole) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const err = new Error(error.message || 'Unable to sign in');
      err.code = error.status || 'AUTH_SIGNIN_FAILED';
      throw err;
    }
    // State will be updated by onAuthStateChange, but ensure immediate UI update:
    setSession(data.session);
    setUser(data.user);

    // If caller provided a role, write it to user_metadata
    if (selectedRole && ['admin', 'instructor', 'student'].includes(selectedRole)) {
      try {
        await setRoleInMetadata(selectedRole);
      } catch {
        // fail-soft; keep going with session established
        setLocalRole(selectedRole);
      }
    } else {
      // No provided role; still mirror metadata role to local if available
      const metaRole = getRoleFromMetadata(data.user);
      if (metaRole) setLocalRole(metaRole);
    }
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
    setLocalRole(null);
  };

  /**
   * PUBLIC_INTERFACE
   * signUp
   * Creates an account with email/password and sends confirmation email.
   * If selectedRole is provided, we attempt to attach it into user_metadata on sign-up.
   * @param {string} email
   * @param {string} password
   * @param {string} [emailRedirectTo] - If omitted, uses REACT_APP_SITE_URL or window.location.origin
   * @param {'admin'|'instructor'|'student'} [selectedRole]
   */
  const signUp = async (email, password, emailRedirectTo, selectedRole) => {
    const redirect = emailRedirectTo || process.env.REACT_APP_SITE_URL || window.location.origin;
    if (!process.env.REACT_APP_SITE_URL) {
      // eslint-disable-next-line no-console
      console.warn('[Auth] REACT_APP_SITE_URL is not set; using window.location.origin for email redirects:', redirect);
    }
    const options = { emailRedirectTo: redirect };
    // Attach initial metadata.role if caller provided a role
    if (selectedRole && ['admin', 'instructor', 'student'].includes(selectedRole)) {
      options.data = { role: selectedRole };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });
    if (error) {
      const err = new Error(error.message || 'Unable to sign up');
      err.code = error.status || 'AUTH_SIGNUP_FAILED';
      throw err;
    }
    // Persist local fallback so post-confirmation sign-in can use it if metadata not yet reflected
    if (selectedRole) setLocalRole(selectedRole);
    return data;
  };

  const value = useMemo(
    () => ({ user, session, initializing, signIn, signOut, signUp, setRoleInMetadata }),
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

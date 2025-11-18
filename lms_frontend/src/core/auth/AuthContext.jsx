import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../clients/supabaseClient';

const AuthCtx = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider
 * Provides user and session from Supabase. Persists session via supabase-js.
 * Exposes signIn(email, password) and signOut().
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

  const value = useMemo(
    () => ({ user, session, initializing, signIn, signOut }),
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

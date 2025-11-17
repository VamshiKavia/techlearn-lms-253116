import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { findUserByCredentials } from '../../shared/mocks/users';

const AuthCtx = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider: Provides user session information and client-only login/logout.
 * Notes:
 * - No backend calls are made.
 * - Optionally persists the authenticated user in localStorage under 'tl_auth_user'.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('tl_auth_user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.email) setUser(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  /**
   * PUBLIC_INTERFACE
   * signIn
   * Authenticate against local mock users.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<void>}
   */
  const signIn = async (email, password) => {
    const matched = findUserByCredentials(email, password);
    if (!matched) {
      const err = new Error('Invalid email or password');
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }
    setUser(matched);
    try {
      localStorage.setItem('tl_auth_user', JSON.stringify(matched));
    } catch {
      // storage may be unavailable; proceed without persistence
    }
  };

  /**
   * PUBLIC_INTERFACE
   * signOut
   * Clear local user state and remove stored session.
   */
  const signOut = async () => {
    setUser(null);
    try {
      localStorage.removeItem('tl_auth_user');
    } catch {
      // ignore
    }
  };

  const value = useMemo(() => ({ user, signIn, signOut }), [user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

/**
 * PUBLIC_INTERFACE
 * useAuth: Access auth context
 */
export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

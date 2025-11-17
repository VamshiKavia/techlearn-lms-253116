import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getSupabaseClient } from '../clients/supabaseClient';

const AuthCtx = createContext(null);

/**
 * PUBLIC_INTERFACE
 * AuthProvider: Provides user session and role information to the app.
 * Placeholder implementation; integrates with Supabase later.
 */
export function AuthProvider({ children }) {
  const supabase = getSupabaseClient();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('student'); // 'admin' | 'instructor' | 'student'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data?.session?.user || null;
      setUser(sessionUser || { email: 'student@example.com' });
      setRole('student');
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener?.subscription?.unsubscribe?.();
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole('student');
  };

  const value = useMemo(() => ({ user, role, setRole, signOut }), [user, role]);
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

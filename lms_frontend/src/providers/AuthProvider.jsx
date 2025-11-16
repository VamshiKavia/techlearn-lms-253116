import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser } from '../services/authService';

/**
 * PUBLIC_INTERFACE
 * Auth context for app-wide user and role state.
 */
export const AuthContext = createContext();

/**
 * PUBLIC_INTERFACE
 * Hook to access auth information.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * PUBLIC_INTERFACE
 * AuthProvider - provides user auth state (mock-friendly).
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  const value = useMemo(() => ({ user, loading, login: () => {}, logout: () => {} }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
export { AuthProvider };

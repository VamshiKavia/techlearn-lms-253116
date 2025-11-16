import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createAuthService } from '../services/authService';

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

// Create a singleton auth service instance for the app
const auth = createAuthService();

/**
 * PUBLIC_INTERFACE
 * AuthProvider - provides user auth state (mock-friendly).
 */
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        // Support either method or property depending on mock implementation
        const maybeUser =
          typeof auth.getCurrentUser === 'function'
            ? await auth.getCurrentUser()
            : auth.currentUser ?? null;
        if (mounted) setUser(maybeUser);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({ user, loading, auth, login: auth?.login, logout: auth?.logout }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
export { AuthProvider };

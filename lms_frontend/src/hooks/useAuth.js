import { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth as useAuthCtx } from '../core/auth/AuthContext';

/**
 * PUBLIC_INTERFACE
 * useAuth
 * Wrapper hook that returns the auth context (user, session, initializing, signIn, signOut, signUp)
 */
export function useAuth() {
  return useAuthCtx();
}

/**
 * PUBLIC_INTERFACE
 * useRequireAuth
 * Protect a route by redirecting unauthenticated users to /auth with ?redirect=<current>.
 * Returns the user if authenticated; returns null while initializing (caller can show loader).
 */
export function useRequireAuth() {
  const { user, initializing } = useAuthCtx();
  const navigate = useNavigate();
  const location = useLocation();

  if (initializing) return null;

  if (!user) {
    const ret = encodeURIComponent(location.pathname + location.search);
    navigate(`/auth?redirect=${ret}`, { replace: true });
    return null;
  }

  return user;
}

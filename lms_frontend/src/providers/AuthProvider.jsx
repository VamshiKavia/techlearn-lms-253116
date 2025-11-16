import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { createApiClient } from '../services/apiClient';
import { createAuthService } from '../services/authService';
import { createCoursesService } from '../services/coursesService';
import { createReviewsService } from '../services/reviewsService';
import { createQnaService } from '../services/qnaService';
import { createCertificatesService } from '../services/certificatesService';
import { useRequestId } from '../hooks/useRequestId';

const STORAGE_KEY = 'lms_auth_v1';

export const AuthContext = createContext({
  user: null,
  token: null,
  role: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  api: null,
  services: null,
});
/**
 * PUBLIC_INTERFACE
 * Simple hook to access AuthContext safely.
 */
export const useAuth = () => React.useContext(AuthContext);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state and configured API/services to the app. */
  const getReqId = useRequestId();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Load persisted session
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setToken(parsed.token || null);
        setUser(parsed.user || null);
      } catch {
        // ignore
      }
    }
  }, []);

  const persist = useCallback((next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getToken = useCallback(() => token, [token]);
  const api = useMemo(() => createApiClient(getToken, getReqId), [getToken, getReqId]);
  const authService = useMemo(() => createAuthService(api), [api]);
  const coursesService = useMemo(() => createCoursesService(api), [api]);
  const reviewsService = useMemo(() => createReviewsService(api), [api]);
  const qnaService = useMemo(() => createQnaService(api), [api]);
  const certificatesService = useMemo(() => createCertificatesService(api), [api]);

  const login = useCallback(async (credentials) => {
    const result = await authService.login(credentials);
    setToken(result.access_token);
    setUser(result.user);
    persist({ token: result.access_token, user: result.user });
    return result.user;
  }, [authService, persist]);

  const signup = useCallback(async (input) => {
    const result = await authService.signup(input);
    setToken(result.access_token);
    setUser(result.user);
    persist({ token: result.access_token, user: result.user });
    return result.user;
  }, [authService, persist]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clear();
  }, [clear]);

  const role = user?.role ?? null;
  const services = useMemo(
    () => ({
      auth: authService,
      courses: coursesService,
      reviews: reviewsService,
      qna: qnaService,
      certificates: certificatesService,
    }),
    [authService, coursesService, reviewsService, qnaService, certificatesService]
  );

  const value = useMemo(
    () => ({ user, token, role, login, signup, logout, api, services }),
    [user, token, role, login, signup, logout, api, services]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

import axios from 'axios';
import { env } from '../config/env';

// PUBLIC_INTERFACE
export function createApiClient(getToken, getRequestId) {
  /** Axios instance configured for the LMS frontend.
   * Attaches JWT from getToken and x-request-id from getRequestId to each request.
   * Handles 401 responses with a TODO for refresh flow.
   */
  const instance = axios.create({
    baseURL: env.API_BASE_URL,
    timeout: 15000,
  });

  instance.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const reqId = getRequestId?.();
    if (reqId) {
      config.headers['x-request-id'] = reqId;
    }
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error?.response?.status === 401) {
        // TODO: implement token refresh using refresh token endpoint
        // For now, just propagate error
      }
      return Promise.reject(error);
    }
  );

  return instance;
}

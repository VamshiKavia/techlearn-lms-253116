import axios from 'axios';
import { env } from '../config/env';

// PUBLIC_INTERFACE
export function createApiClient(getToken, getRequestId) {
  /** Axios instance configured for the LMS frontend.
   * Attaches JWT from getToken and x-request-id from getRequestId to each request.
   * Handles 401 responses with a TODO for refresh flow.
   */
  const instance = axios.create({
    // All service calls target FastAPI under /api/v1
    baseURL: `${env.API_BASE_URL}/api/v1`,
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
      // Surface backend error if present to aid debugging CORS/mixed-content/misconfig
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Request failed';
      return Promise.reject(new Error(msg));
    }
  );

  return instance;
}

/**
 * Environment resolution for frontend configuration.
 * Normalizes API base URL (backend origin) for use in services.
 * Priority:
 *  - REACT_APP_API_BASE
 *  - REACT_APP_BACKEND_URL
 *  - REACT_APP_API_BASE_URL
 * Fallback to http://localhost:3001 for local dev.
 */
const RAW_API_BASE =
  (process.env.REACT_APP_API_BASE || '').trim() ||
  (process.env.REACT_APP_BACKEND_URL || '').trim() ||
  (process.env.REACT_APP_API_BASE_URL || '').trim() ||
  '';

/**
 * Ensure no trailing slashes and default to localhost:3001 when not provided.
 * Note: Our fetch helpers typically append `/api/v1` path.
 */
const API_BASE_URL = (RAW_API_BASE || 'http://localhost:3001').replace(/\/+$/, '');

const ENABLE_MOCKS = String(process.env.REACT_APP_ENABLE_MOCKS || 'true') === 'true';
const APP_NAME = process.env.REACT_APP_APP_NAME || 'TechLearn LMS';

export const env = {
  API_BASE_URL,
  ENABLE_MOCKS,
  APP_NAME,
};

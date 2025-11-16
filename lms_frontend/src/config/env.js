const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || '').trim() || 'http://localhost:3001';
const ENABLE_MOCKS = String(process.env.REACT_APP_ENABLE_MOCKS || 'true') === 'true';
const APP_NAME = process.env.REACT_APP_APP_NAME || 'TechLearn LMS';

export const env = {
  API_BASE_URL,
  ENABLE_MOCKS,
  APP_NAME,
};

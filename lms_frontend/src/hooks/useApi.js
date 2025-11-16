import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

// PUBLIC_INTERFACE
export function useApi() {
  /** Returns the axios api client from AuthProvider context. */
  const { api } = useContext(AuthContext);
  return api;
}

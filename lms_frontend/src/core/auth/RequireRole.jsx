import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/**
 * PUBLIC_INTERFACE
 * RequireRole: Wraps routes that require one of the specified roles.
 * @param {object} props
 * @param {string[]} props.roles
 * @param {React.ReactNode} props.children
 */
export function RequireRole({ roles = [], children }) {
  const { role } = useAuth();
  if (!roles.includes(role)) {
    return <Navigate to="/student/overview" replace />;
  }
  return <>{children}</>;
}

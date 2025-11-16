import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';

// PUBLIC_INTERFACE
export function ProtectedRoute({ allowedRoles }) {
  /** Protects nested routes; redirects to /login if not authenticated or unauthorized. */
  const { user, role } = React.useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

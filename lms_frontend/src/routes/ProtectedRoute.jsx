import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider.jsx';

// PUBLIC_INTERFACE
export default function ProtectedRoute({ children, roles }) {
  /** Protects routes: requires auth and one of the roles if provided. */
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(roles) && roles.length > 0) {
    const userRole = (user.role || '').toLowerCase();
    const normalizedRoles = roles.map((r) => (r || '').toLowerCase());
    const allowed = normalizedRoles.includes(userRole);
    if (!allowed) {
      if (userRole === 'instructor') return <Navigate to="/instructor/overview" replace />;
      if (userRole === 'student') return <Navigate to="/student/overview" replace />;
      if (userRole === 'admin') return <Navigate to="/admin/overview" replace />;
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

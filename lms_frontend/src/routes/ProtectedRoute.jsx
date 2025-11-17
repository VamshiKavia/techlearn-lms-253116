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
    const allowed = roles.includes(user.role);
    if (!allowed) {
      if (user.role === 'Instructor') return <Navigate to="/instructor/overview" replace />;
      if (user.role === 'Student') return <Navigate to="/student/overview" replace />;
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

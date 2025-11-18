import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Topbar: Displays minor app label and user actions (Home, Login/Logout).
 */
export function Topbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const onHome = () => navigate('/student/overview');
  const onLogout = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch {
      // no-op
    }
  };
  const onLogin = () => navigate('/login');

  return (
    <div className="neon-surface" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>TechLearn LMS</div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button className="btn btn-outline" onClick={onHome} aria-label="Go to Home">Home</button>
        {user ? (
          <button className="btn btn-primary" onClick={onLogout} aria-label="Logout">Logout</button>
        ) : (
          <button className="btn btn-primary" onClick={onLogin} aria-label="Login">Login</button>
        )}
      </div>
    </div>
  );
}

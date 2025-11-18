import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import { useUI } from '../../core/ui/UIContext';

/**
 * PUBLIC_INTERFACE
 * Topbar: Displays minor app label and user actions (Menu toggle, Home, Login/Logout).
 */
export function Topbar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toggleSidebar } = useUI();

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
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hamburger menu — visible on mobile; harmless on desktop */}
        <button
          type="button"
          className="btn btn-ghost topbar-menu"
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
        >
          {/* simple hamburger icon */}
          <span aria-hidden="true" style={{ display: 'inline-flex', flexDirection: 'column', gap: 3 }}>
            <span style={{ width: 18, height: 2, background: 'currentColor', borderRadius: 2 }} />
            <span style={{ width: 18, height: 2, background: 'currentColor', borderRadius: 2 }} />
            <span style={{ width: 18, height: 2, background: 'currentColor', borderRadius: 2 }} />
          </span>
        </button>

        <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>TechLearn LMS</div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <ThemeToggle />
        <button className="btn btn-outline" onClick={onHome} aria-label="Go to Home">Home</button>
        {user ? (
          <button className="btn btn-primary" onClick={onLogout} aria-label="Logout">Logout</button>
        ) : (
          <button className="btn btn-primary" onClick={onLogin} aria-label="Login">Login</button>
        )}
      </div>
    </>
  );
}

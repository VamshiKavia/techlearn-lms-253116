import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * MainLayout with top navigation applying Ocean Professional theme.
 */
export default function MainLayout() {
  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;
  return (
    <div>
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <strong style={{ color: 'var(--primary)' }}>TechLearn LMS</strong>
          <nav style={{ display: 'flex', gap: 8 }}>
            <NavLink to="/" className={linkClass} end aria-label="Home">Home</NavLink>
            <NavLink to="/login" className={linkClass} aria-label="Login">Login</NavLink>
            <NavLink to="/signup" className={linkClass} aria-label="Signup">Signup</NavLink>
          </nav>
        </div>
        <div />
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}

import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import '../../styles/theme.css';

// PUBLIC_INTERFACE
export default function MainLayout() {
  /** Public layout with a simple top navigation. */
  return (
    <div>
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <strong style={{ color: 'var(--color-primary)' }}>TechLearn LMS</strong>
          <nav style={{ display: 'flex', gap: 12 }}>
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </nav>
        </div>
      </header>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}

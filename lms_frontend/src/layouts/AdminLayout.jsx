import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import { useUI } from '../core/ui/UIContext';

/**
 * PUBLIC_INTERFACE
 * AdminLayout
 * Provides a minimal Ocean Professional-styled layout for the Admin area with its own sidebar/topbar.
 * Mirrors student layout behavior with responsive sidebar slide transitions and overlay.
 */
export function AdminLayout({ children }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useUI();

  const isActive = (to) => location.pathname === to;

  const handleHome = () => navigate('/student/overview');
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch {
      // no-op
    }
  };

  const rootClass = `app ${isSidebarOpen ? 'is-sidebar-open' : 'is-sidebar-closed'}`;

  return (
    <div className={rootClass}>
      {/* Admin Sidebar */}
      <aside
        className="sidebar-panel"
        role="navigation"
        aria-label="Admin"
        aria-hidden={!isSidebarOpen}
        style={{
          visibility: isSidebarOpen ? 'visible' : 'hidden',
          pointerEvents: isSidebarOpen ? 'auto' : 'none',
        }}
      >
        <div className="sidebar-content" aria-hidden={!isSidebarOpen}>
          <div className="brand">TechLearn Admin</div>
          <div className="userEmail" aria-label="user-email">{user?.email || 'unknown@techlearn'}</div>
          <ul className="navList">
            <li>
              <NavLink
                to="/admin"
                className={`navItem ${isActive('/admin') ? 'active' : ''}`}
                aria-current={isActive('/admin') ? 'page' : undefined}
                onClick={closeSidebar}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/courses"
                className={`navItem ${isActive('/admin/courses') ? 'active' : ''}`}
                aria-current={isActive('/admin/courses') ? 'page' : undefined}
                onClick={closeSidebar}
              >
                Courses
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/courses/new"
                className={`navItem ${isActive('/admin/courses/new') ? 'active' : ''}`}
                aria-current={isActive('/admin/courses/new') ? 'page' : undefined}
                onClick={closeSidebar}
              >
                New Course
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/account"
                className={`navItem ${isActive('/account') ? 'active' : ''}`}
                aria-current={isActive('/account') ? 'page' : undefined}
                onClick={closeSidebar}
              >
                Account
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>

      {/* Scrim overlay for mobile */}
      <button
        type="button"
        className={`scrim ${isSidebarOpen ? 'visible' : ''}`}
        aria-label="Close sidebar"
        onClick={closeSidebar}
      />

      {/* Admin Topbar */}
      <header className="topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            type="button"
            className="btn btn-ghost topbar-menu"
            aria-label="Toggle sidebar"
            onClick={toggleSidebar}
          >
            <span aria-hidden="true" style={{ display: 'inline-flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ width: 18, height: 2, background: 'currentColor', borderRadius: 2 }} />
              <span style={{ width: 18, height: 2, background: 'currentColor', borderRadius: 2 }} />
              <span style={{ width: 18, height: 2, background: 'currentColor', borderRadius: 2 }} />
            </span>
          </button>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>Admin Console</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-outline" onClick={handleHome}>Student Home</button>
          {user ? (
            <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/login')}>Login</button>
          )}
        </div>
      </header>

      {/* Admin Content */}
      <main className="main" id="admin-content">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;

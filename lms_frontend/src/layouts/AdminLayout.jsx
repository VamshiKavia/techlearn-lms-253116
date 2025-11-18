import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';

/**
 * PUBLIC_INTERFACE
 * AdminLayout
 * Provides a minimal Ocean Professional-styled layout for the Admin area with its own sidebar/topbar.
 * Contains nav links: Dashboard (/admin), Courses (/admin/courses), New Course (/admin/courses/new), and Account (/account).
 * A signed-in user is required to access Admin routes (actual RBAC TODO).
 *
 * Usage: Wrap admin routes so they render inside this layout.
 */
export function AdminLayout({ children }) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <div className="app">
      {/* Admin Sidebar */}
      <aside className="sidebar" role="navigation" aria-label="Admin">
        <div className="brand">TechLearn Admin</div>
        <div className="userEmail" aria-label="user-email">{user?.email || 'unknown@techlearn'}</div>
        <ul className="navList">
          <li>
            <NavLink
              to="/admin"
              className={`navItem ${isActive('/admin') ? 'active' : ''}`}
              aria-current={isActive('/admin') ? 'page' : undefined}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/courses"
              className={`navItem ${isActive('/admin/courses') ? 'active' : ''}`}
              aria-current={isActive('/admin/courses') ? 'page' : undefined}
            >
              Courses
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/courses/new"
              className={`navItem ${isActive('/admin/courses/new') ? 'active' : ''}`}
              aria-current={isActive('/admin/courses/new') ? 'page' : undefined}
            >
              New Course
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/account"
              className={`navItem ${isActive('/account') ? 'active' : ''}`}
              aria-current={isActive('/account') ? 'page' : undefined}
            >
              Account
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* Admin Topbar */}
      <header className="topbar">
        <div style={{ color: '#64748B', fontSize: 12 }}>Admin Console</div>
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

import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import '../../styles/theme.css';
import { AuthContext } from '../../providers/AuthProvider';

/**
 * PUBLIC_INTERFACE
 * Role-based dashboard layout with sidebar navigation and topbar.
 */
export default function DashboardLayout() {
  const { user, role, logout } = React.useContext(AuthContext);

  const navByRole = {
    admin: [
      { to: '/admin/overview', label: 'Overview' },
      { to: '/admin/courses', label: 'Courses' },
    ],
    instructor: [
      { to: '/instructor/overview', label: 'Overview' },
      { to: '/instructor/courses', label: 'My Courses' },
      { to: '/instructor/courses/new', label: 'Create Course' },
    ],
    student: [
      { to: '/student/overview', label: 'Overview' },
      { to: '/student/learning', label: 'My Learning' },
      { to: '/student/catalog', label: 'Catalog' },
      { to: '/student/paths/full-stack', label: 'Full-Stack' },
      { to: '/student/paths/data-science', label: 'Data Science' },
      { to: '/student/paths/cloud', label: 'Cloud' },
      { to: '/student/paths/devops', label: 'DevOps' },
      { to: '/student/paths/testing', label: 'Software Testing', testId: 'nav-testing' },
      { to: '/student/paths/ai', label: 'AI', testId: 'nav-ai' },
      { to: '/student/reviews', label: 'Reviews' },
      { to: '/student/qna', label: 'Q&A' },
      { to: '/student/certificates', label: 'Certificates' },
    ],
  };

  const links = navByRole[role] || [];
  const linkClass = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand" style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: 12 }}>TechLearn</div>
        <div style={{ marginBottom: 12, color: 'var(--muted)' }}>
          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Signed in</div>
          <div style={{ fontWeight: 600 }}>{user?.email}</div>
          <div style={{ fontSize: 12, opacity: .85 }}>Role: {role}</div>
        </div>
        <nav aria-label="Sidebar" style={{ display: 'grid', gap: 4 }}>
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} end className={linkClass} data-testid={item.testId || undefined}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div>
        <div className="topbar">
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Link to="/">TechLearn LMS</Link>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link className="btn ghost" to="/">Home</Link>
            <button className="btn" onClick={logout}>Logout</button>
          </div>
        </div>
        <main className="container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Sidebar: Student-only left navigation; shows brand and user email.
 */
export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: 'Overview', to: '/student/overview' },
    { label: 'Catalog', to: '/catalog' },
    { label: 'Data Science', to: '/catalog/data-science' },
    { label: 'Cloud', to: '/catalog/cloud' },
    { label: 'Software Testing', to: '/catalog/software-testing' },
    { label: 'AI', to: '/catalog/ai' },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <div>
      <div className="brand">TechLearn</div>
      <div className="userEmail" aria-label="user-email">{user?.email || 'guest@techlearn'}</div>
      <ul className="navList">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={`navItem ${isActive(item.to) ? 'active' : ''}`}
              aria-current={isActive(item.to) ? 'page' : undefined}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

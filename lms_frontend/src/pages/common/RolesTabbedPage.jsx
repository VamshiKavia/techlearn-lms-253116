import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * RolesTabbedPage: Tabbed page that switches content for Admin, Student, and Instructor roles.
 * - Accessible tabs with arrow-key navigation (Left/Right) and Enter/Space activation.
 * - Uses Ocean Professional theme via existing CSS variables and styles.
 */
export function RolesTabbedPage() {
  const tabs = useMemo(
    () => [
      { id: 'admin', label: 'Admin' },
      { id: 'student', label: 'Student' },
      { id: 'instructor', label: 'Instructor' },
    ],
    []
  );
  const [active, setActive] = useState('admin');
  const tabRefs = useRef({});

  const onKeyDown = useCallback(
    (e, idx) => {
      const isLeft = e.key === 'ArrowLeft';
      const isRight = e.key === 'ArrowRight';
      const isHome = e.key === 'Home';
      const isEnd = e.key === 'End';
      const isActivate = e.key === 'Enter' || e.key === ' ';

      const max = tabs.length - 1;

      if (isLeft || isRight || isHome || isEnd) {
        e.preventDefault();
        let nextIndex = idx;
        if (isLeft) nextIndex = idx === 0 ? max : idx - 1;
        if (isRight) nextIndex = idx === max ? 0 : idx + 1;
        if (isHome) nextIndex = 0;
        if (isEnd) nextIndex = max;

        const nextTab = tabs[nextIndex];
        tabRefs.current[nextTab.id]?.focus();
      }

      if (isActivate) {
        e.preventDefault();
        setActive(tabs[idx].id);
      }
    },
    [tabs]
  );

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1>Roles</h1>
          <div className="subtitle">Switch between Admin, Student, and Instructor views.</div>
        </div>
      </div>

      {/* Tablist */}
      <div
        className="tabs"
        role="tablist"
        aria-label="Role tabs"
        style={{
          display: 'flex',
          gap: 8,
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: 16,
        }}
      >
        {tabs.map((t, idx) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => (tabRefs.current[t.id] = el)}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${t.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(t.id)}
              onKeyDown={(e) => onKeyDown(e, idx)}
              className={`tab ${isActive ? 'tab--active' : ''}`}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #1D4ED8' : '2px solid transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                padding: '10px 12px',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      <section
        id="panel-admin"
        role="tabpanel"
        aria-labelledby="tab-admin"
        hidden={active !== 'admin'}
      >
        <div className="card panel">
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Admin</div>
          <p style={{ color: 'var(--text-secondary)', marginTop: 0 }}>
            Manage platform settings, users, categories, and global announcements.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" to="/admin">Open Admin Dashboard</Link>
            <Link className="btn btn-outline" to="/catalog">Browse Catalog</Link>
          </div>
        </div>
      </section>

      <section
        id="panel-student"
        role="tabpanel"
        aria-labelledby="tab-student"
        hidden={active !== 'student'}
      >
        <div className="card panel">
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Student</div>
          <p style={{ color: 'var(--text-secondary)', marginTop: 0 }}>
            Track progress, continue learning, and explore new courses tailored to you.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" to="/student/overview">Student Overview</Link>
            <Link className="btn btn-outline" to="/catalog">Find Courses</Link>
          </div>
        </div>
      </section>

      <section
        id="panel-instructor"
        role="tabpanel"
        aria-labelledby="tab-instructor"
        hidden={active !== 'instructor'}
      >
        <div className="card panel">
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Instructor</div>
          <p style={{ color: 'var(--text-secondary)', marginTop: 0 }}>
            Create courses, manage lessons, grade assignments, and view student analytics.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" to="/instructor">Open Instructor Dashboard</Link>
            <Link className="btn btn-outline" to="/catalog">Review Catalog</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

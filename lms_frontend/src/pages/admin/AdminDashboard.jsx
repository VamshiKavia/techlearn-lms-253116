import React from 'react';
import { useAuth } from '../../core/auth/AuthContext';
import { CourseCreateForm } from './CourseCreateForm';

/**
 * PUBLIC_INTERFACE
 * AdminDashboard
 * Admin landing page with a "Create Course" section.
 * Temporarily guards access for any signed-in user and shows a warning banner that
 * role-based authorization will be enforced once roles are configured in Supabase.
 */
export function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1>Admin</h1>
          <div className="subtitle">Manage courses and platform content.</div>
        </div>
      </div>

      {/* Temporary access warning until proper RBAC is enforced */}
      <div
        role="status"
        className="card reveal-on-appear revealed"
        style={{
          padding: 12,
          borderRadius: 12,
          marginBottom: 12,
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          color: '#92400E',
          fontSize: 13,
        }}
      >
        You are signed in as {user?.email || 'unknown user'}. Role-based access control will be enforced once roles are configured in Supabase. For now, any authenticated user can access this page.
      </div>

      <section className="card reveal-on-appear revealed" style={{ padding: 16, borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Create Course</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Add basic course details</div>
        </div>
        <CourseCreateForm />
      </section>
    </div>
  );
}

export default AdminDashboard;

import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * RoleManagement: Admin page to manage roles using local state with CRUD operations.
 * - No backend calls; all changes are ephemeral for demo purposes.
 * - Uses Ocean Professional theme via existing layout.css/theme.css.
 */
export function RoleManagement() {
  // Seed roles: Admin/Instructor/Student
  const initial = useMemo(
    () => [
      { id: 'admin', name: 'Admin', description: 'Full system access and settings control', permissions: ['manage_users', 'manage_courses', 'view_reports'] },
      { id: 'instructor', name: 'Instructor', description: 'Create and manage courses, grade assignments', permissions: ['create_courses', 'manage_lessons', 'grade'] },
      { id: 'student', name: 'Student', description: 'Enroll in courses and track progress', permissions: ['enroll', 'view_lessons', 'submit_assignments'] },
    ],
    []
  );

  const [roles, setRoles] = useState(initial);
  const [q, setQ] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ id: '', name: '', description: '', permissions: '' });

  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return roles;
    return roles.filter(
      (r) =>
        r.id.toLowerCase().includes(term) ||
        r.name.toLowerCase().includes(term) ||
        (r.description || '').toLowerCase().includes(term) ||
        (r.permissions || []).join(',').toLowerCase().includes(term)
    );
  }, [roles, q]);

  const resetForm = () => {
    setForm({ id: '', name: '', description: '', permissions: '' });
    setEditing(null);
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (role) => {
    setEditing(role.id);
    setForm({
      id: role.id,
      name: role.name,
      description: role.description || '',
      permissions: (role.permissions || []).join(', '),
    });
    setShowModal(true);
  };

  const onDelete = (roleId) => {
    // local state delete
    setRoles((prev) => prev.filter((r) => r.id !== roleId));
    // If we were editing the same, reset
    if (editing === roleId) resetForm();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    const id = (form.id || '').trim().toLowerCase().replace(/\s+/g, '-');
    const name = (form.name || '').trim();
    if (!id || !name) {
      alert('Please provide both a unique ID and a Name for the role.');
      return;
    }
    const permissions = (form.permissions || '')
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    setRoles((prev) => {
      const exists = prev.some((r) => r.id === id);
      if (editing) {
        // Update existing by id (id is not allowed to change to avoid collisions)
        return prev.map((r) =>
          r.id === editing ? { ...r, name, description: form.description, permissions } : r
        );
      }
      if (exists) {
        alert('A role with this ID already exists. Please choose a different ID.');
        return prev;
      }
      return [...prev, { id, name, description: form.description, permissions }];
    });

    setShowModal(false);
    resetForm();
  };

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1>Role Management</h1>
          <div className="subtitle">Create, edit, and remove application roles. Local state only (no backend).</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={() => navigate('/admin')} aria-label="Go to Admin Dashboard">
            Admin Home
          </button>
          <button className="btn btn-primary" onClick={openAdd} aria-label="Add role">
            Add Role
          </button>
        </div>
      </div>

      <div className="card panel" style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <input
            aria-label="Search roles"
            placeholder="Search roles…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              height: 40,
              padding: '8px 12px',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              width: '100%',
              maxWidth: 360,
            }}
          />
          <button className="btn btn-outline" onClick={() => setQ('')}>
            Clear
          </button>
        </div>
      </div>

      <div className="card panel" role="region" aria-label="Roles table">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                <th style={{ padding: '10px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>ID</th>
                <th style={{ padding: '10px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '10px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>Description</th>
                <th style={{ padding: '10px 8px', color: 'var(--text-secondary)', fontWeight: 600 }}>Permissions</th>
                <th style={{ padding: '10px 8px', color: 'var(--text-secondary)', fontWeight: 600 }} aria-label="Actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 12, color: 'var(--text-muted)' }}>
                    No roles found.
                  </td>
                </tr>
              )}
              {filtered.map((r) => (
                <tr key={r.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '10px 8px' }}>{r.id}</td>
                  <td style={{ padding: '10px 8px', fontWeight: 600 }}>{r.name}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>{r.description || '—'}</td>
                  <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>
                    {(r.permissions || []).join(', ')}
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline" onClick={() => openEdit(r)} aria-label={`Edit ${r.name}`}>
                        Edit
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => onDelete(r.id)}
                        aria-label={`Delete ${r.name}`}
                        style={{ background: '#EF4444', borderColor: '#EF4444' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="role-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 50,
          }}
          onClick={(e) => {
            // click outside to close
            if (e.target === e.currentTarget) {
              setShowModal(false);
              resetForm();
            }
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: 560,
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 12,
              boxShadow: 'var(--shadow-lg)',
              padding: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div id="role-modal-title" style={{ fontSize: 18, fontWeight: 700 }}>
                {editing ? 'Edit Role' : 'Add Role'}
              </div>
              <button className="btn btn-outline" onClick={() => { setShowModal(false); resetForm(); }} aria-label="Close modal">
                Close
              </button>
            </div>

            <form onSubmit={onSubmit}>
              <div style={{ display: 'grid', gap: 12 }}>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Role ID</span>
                  <input
                    value={form.id}
                    onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                    placeholder="e.g., admin, instructor, student"
                    aria-disabled={!!editing}
                    disabled={!!editing}
                    style={{
                      height: 40,
                      padding: '8px 12px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 8,
                    }}
                  />
                </label>

                <label style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Role Name</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Display name (e.g., Admin)"
                    style={{
                      height: 40,
                      padding: '8px 12px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 8,
                    }}
                  />
                </label>

                <label style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Description</span>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    placeholder="Describe what this role can do"
                    style={{
                      padding: '8px 12px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 8,
                      resize: 'vertical',
                    }}
                  />
                </label>

                <label style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Permissions (comma-separated)</span>
                  <input
                    value={form.permissions}
                    onChange={(e) => setForm((f) => ({ ...f, permissions: e.target.value }))}
                    placeholder="e.g., manage_users, manage_courses, view_reports"
                    style={{
                      height: 40,
                      padding: '8px 12px',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 8,
                    }}
                  />
                </label>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Save Changes' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSupabaseClient } from '../../core/clients/supabaseClient';
import { listCourses, deleteCourse as svcDeleteCourse } from '../../core/services/courseService';

/**
 * PUBLIC_INTERFACE
 * CourseList (Admin)
 * Lists courses from Supabase with search, status filter, pagination, and row actions (Edit, View, Delete).
 * Minimalist Ocean Professional styling with loading and error states.
 */
export default function CourseList() {
  const supabase = useMemo(() => getSupabaseClient(), []);
  const navigate = useNavigate();

  // Query state
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all'); // all | draft | published
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Data state
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, count, error: err } = await listCourses(supabase, {
        search: q,
        status: status === 'all' ? undefined : status,
        page,
        pageSize,
      });
      if (err) throw new Error(err);
      setRows(data || []);
      setTotal(count || 0);
    } catch (e) {
      setError(e?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, page]);

  const handleDelete = async (id) => {
    if (!id) return;
    const ok = window.confirm('Delete this course? This cannot be undone.');
    if (!ok) return;
    setDeletingId(id);
    try {
      const { error: err } = await svcDeleteCourse(supabase, id);
      if (err) throw new Error(err);
      // Optimistic remove from current list
      setRows((r) => r.filter((x) => x.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e?.message || 'Delete failed');
    } finally {
      setDeletingId('');
    }
  };

  const resetToFirstPage = (setter) => (val) => {
    setter(val);
    setPage(1);
  };

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1>Courses</h1>
          <div className="subtitle">Admin-only management of courses.</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/admin" className="btn btn-outline">Admin Home</Link>
          <Link to="/admin/courses/new" className="btn btn-primary">New Course</Link>
        </div>
      </div>

      {/* Controls */}
      <div className="card" style={{ padding: 12, borderRadius: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            aria-label="Search courses"
            value={q}
            onChange={(e) => resetToFirstPage(setQ)(e.target.value)}
            placeholder="Search by title…"
            style={{
              height: 40,
              padding: '8px 12px',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              width: 'min(360px, 100%)',
            }}
          />
          <select
            aria-label="Status filter"
            value={status}
            onChange={(e) => resetToFirstPage(setStatus)(e.target.value)}
            style={{
              height: 40,
              padding: '8px 12px',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              background: 'white',
            }}
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          <button className="btn btn-outline" onClick={() => { setQ(''); setStatus('all'); setPage(1); }}>
            Clear
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#7F1D1D',
            padding: '8px 10px',
            borderRadius: 8,
            marginBottom: 12,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* Table */}
      <div className="card" style={{ borderRadius: 12, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'var(--bg-subtle)' }}>
            <tr>
              <Th>ID</Th>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th>Created At</Th>
              <Th>Created By</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: 16, color: 'var(--text-secondary)' }}>
                  Loading…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 16, color: 'var(--text-secondary)' }}>
                  No courses found.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <Td><Mono>{truncate(r.id, 8)}</Mono></Td>
                  <Td>{r.title || '—'}</Td>
                  <Td>
                    <Badge tone={r.status === 'published' ? 'success' : 'default'}>
                      {r.status || 'draft'}
                    </Badge>
                  </Td>
                  <Td>{formatDate(r.created_at)}</Td>
                  <Td><Mono>{r.created_by ? truncate(r.created_by, 8) : '—'}</Mono></Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-outline"
                        onClick={() => navigate(`/admin/courses/${encodeURIComponent(r.id)}/edit`)}
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline"
                        onClick={() => window.open(`/catalog`, '_blank', 'noopener')}
                        title="View (public)"
                      >
                        View
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleDelete(r.id)}
                        disabled={deletingId === r.id}
                        aria-busy={deletingId === r.id ? 'true' : 'false'}
                        title="Delete"
                      >
                        {deletingId === r.id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Page {page} of {totalPages} • {total} total
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>
          <button
            className="btn btn-outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th style={{ textAlign: 'left', fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, padding: '10px 12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {children}
    </th>
  );
}

function Td({ children }) {
  return (
    <td style={{ padding: '10px 12px', fontSize: 14, color: 'var(--text-primary)' }}>
      {children}
    </td>
  );
}

function Badge({ tone = 'default', children }) {
  const styles = tone === 'success'
    ? { background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534' }
    : { background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' };
  return (
    <span style={{ ...styles, padding: '4px 8px', fontSize: 12, fontWeight: 600, borderRadius: 9999, textTransform: 'capitalize' }}>
      {children}
    </span>
  );
}

function Mono({ children }) {
  return <span style={{ fontFamily: 'monospace' }}>{children}</span>;
}

function truncate(s, n) {
  const str = String(s || '');
  if (str.length <= n) return str;
  return `${str.slice(0, n)}…`;
}

function formatDate(d) {
  if (!d) return '—';
  try {
    const dt = new Date(d);
    return dt.toLocaleString();
  } catch {
    return d;
  }
}

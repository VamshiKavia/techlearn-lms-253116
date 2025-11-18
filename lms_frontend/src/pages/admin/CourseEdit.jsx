import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSupabaseClient } from '../../core/clients/supabaseClient';
import { getCourseById, updateCourse, deleteCourse as svcDeleteCourse } from '../../core/services/courseService';

/**
 * PUBLIC_INTERFACE
 * CourseEdit (Admin)
 * Load a course by id and allow editing/updating via Supabase. Provides Save and Delete.
 * Shows not-found message if record is missing.
 */
export default function CourseEdit() {
  const { id } = useParams();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    category: '',
    level: '',
    price: '',
    isFree: false,
    description: '',
    thumbnailUrl: '',
    status: 'draft',
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      setNotFound(false);
      try {
        const { data, error: err } = await getCourseById(supabase, id);
        if (err) throw new Error(err);
        if (!data) {
          setNotFound(true);
          return;
        }
        // Map DB fields to form
        setForm({
          title: data.title || '',
          subtitle: data.subtitle || '',
          category: data.category || '',
          level: data.level || '',
          price: data.price ?? '',
          isFree: !!data.is_free,
          description: data.description || '',
          thumbnailUrl: data.thumbnail_url || '',
          status: data.status || 'draft',
        });
      } catch (e) {
        setError(e?.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, supabase]);

  const onChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const validate = () => {
    const errs = [];
    if (!form.title.trim()) errs.push('Title is required');
    if (form.isFree) {
      if (form.price !== '' && Number.isNaN(Number(form.price))) {
        errs.push('Price must be a number');
      }
      if (form.price !== '' && Number(form.price) < 0) {
        errs.push('Price must be 0 or a positive number');
      }
    } else {
      if (form.price === '' || Number.isNaN(Number(form.price))) {
        errs.push('Price is required and must be a number');
      } else if (Number(form.price) < 0) {
        errs.push('Price must be 0 or a positive number');
      }
    }
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    const errs = validate();
    if (errs.length) {
      setError(errs.join('. '));
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        category: form.category.trim() || null,
        level: form.level.trim() || null,
        price: form.price === '' ? null : Number(form.price),
        is_free: !!form.isFree,
        description: form.description.trim() || null,
        thumbnail_url: form.thumbnailUrl.trim() || null,
        status: (form.status || 'draft').trim(),
      };
      const { data, error: err } = await updateCourse(supabase, id, payload);
      if (err) throw new Error(err);
      setSuccess('Course updated successfully.');
      // Optimistic: no redirect; leave on page
    } catch (ex) {
      setError(ex?.message || 'Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm('Delete this course? This cannot be undone.');
    if (!ok) return;
    setDeleting(true);
    try {
      const { error: err } = await svcDeleteCourse(supabase, id);
      if (err) throw new Error(err);
      navigate('/admin/courses', { replace: true });
    } catch (ex) {
      setError(ex?.message || 'Failed to delete course');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: 16, borderRadius: 12 }}>
        Loading…
      </div>
    );
  }

  if (notFound) {
    return (
      <div>
        <div className="pageHeader">
          <div>
            <h1>Course Not Found</h1>
            <div className="subtitle">No course exists with id {id}.</div>
          </div>
          <div />
        </div>
        <div className="card" style={{ padding: 16, borderRadius: 12 }}>
          <Link to="/admin/courses" className="btn btn-outline">Back to list</Link>
        </div>
      </div>
    );
  }

  const Label = ({ children }) => (
    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{children}</span>
  );
  const Input = (props) => (
    <input
      {...props}
      style={{
        height: 40,
        padding: '8px 12px',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        ...props.style,
      }}
    />
  );
  const Textarea = (props) => (
    <textarea
      {...props}
      rows={5}
      style={{
        padding: '8px 12px',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        resize: 'vertical',
        ...props.style,
      }}
    />
  );
  const Select = (props) => (
    <select
      {...props}
      style={{
        height: 40,
        padding: '8px 12px',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        background: 'white',
        ...props.style,
      }}
    />
  );

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1>Edit Course</h1>
          <div className="subtitle">Update details for course {id}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Link to="/admin/courses" className="btn btn-outline">Back to list</Link>
          <Link to="/admin" className="btn btn-outline">Admin Home</Link>
        </div>
      </div>

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
      {success && (
        <div
          role="status"
          style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '8px 10px',
            borderRadius: 8,
            marginBottom: 12,
            fontSize: 13,
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleSave} noValidate className="card" style={{ padding: 16, borderRadius: 12 }}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="e.g., Full Stack React & Node.js"
              aria-required="true"
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <Label>Subtitle</Label>
            <Input
              value={form.subtitle}
              onChange={(e) => onChange('subtitle', e.target.value)}
              placeholder="Short subtitle"
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <Label>Category</Label>
            <Input
              value={form.category}
              onChange={(e) => onChange('category', e.target.value)}
              placeholder="e.g., Full Stack, AI"
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <Label>Level</Label>
            <Select
              value={form.level}
              onChange={(e) => onChange('level', e.target.value)}
            >
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <Label>Price</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => onChange('price', e.target.value)}
              placeholder="0.00"
              disabled={form.isFree}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24 }}>
            <input
              type="checkbox"
              checked={form.isFree}
              onChange={(e) => onChange('isFree', e.target.checked)}
            />
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>This course is free</span>
          </label>

          <label style={{ display: 'grid', gap: 6, gridColumn: '1 / span 2' }}>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => onChange('description', e.target.value)}
              placeholder="Describe the course content, learning outcomes, and prerequisites."
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <Label>Thumbnail URL</Label>
            <Input
              value={form.thumbnailUrl}
              onChange={(e) => onChange('thumbnailUrl', e.target.value)}
              placeholder="https://example.com/thumbnail.png"
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <Label>Status</Label>
            <Select
              value={form.status}
              onChange={(e) => onChange('status', e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            aria-busy={saving ? 'true' : 'false'}
            style={{ height: 40 }}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/admin/courses')}
            disabled={saving}
            style={{ height: 40 }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleDelete}
            disabled={deleting}
            aria-busy={deleting ? 'true' : 'false'}
            style={{ height: 40, marginLeft: 'auto' }}
            title="Delete this course"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </form>
    </div>
  );
}

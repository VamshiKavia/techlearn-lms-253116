import React, { useMemo, useState } from 'react';
import { createCourse } from '../../core/services/courseService';
import { getSupabaseClient } from '../../core/clients/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * CourseCreateForm
 * Form for creating a course with client-side validation and Supabase persistence.
 */
export function CourseCreateForm() {
  const supabase = useMemo(() => getSupabaseClient(), []);
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

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const validate = () => {
    const errs = [];
    if (!form.title.trim()) errs.push('Title is required');
    if (form.isFree) {
      // If free, price is optional but if provided must be numeric and >= 0
      if (form.price !== '' && Number.isNaN(Number(form.price))) {
        errs.push('Price must be a number');
      }
      if (form.price !== '' && Number(form.price) < 0) {
        errs.push('Price must be 0 or a positive number');
      }
    } else {
      // If not free, price is required and must be >= 0
      if (form.price === '' || Number.isNaN(Number(form.price))) {
        errs.push('Price is required and must be a number');
      } else if (Number(form.price) < 0) {
        errs.push('Price must be 0 or a positive number');
      }
    }
    return errs;
  };

  const reset = () => {
    setForm({
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
  };

  const handleSubmit = async (e) => {
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

      const { data, error: err } = await createCourse(supabase, payload);
      if (err) throw new Error(err);
      setSuccess('Course created successfully.');
      reset();
    } catch (ex) {
      setError(ex?.message || 'Failed to create course');
    } finally {
      setSaving(false);
    }
  };

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
    <form onSubmit={handleSubmit} noValidate>
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

      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: '1fr 1fr',
        }}
      >
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
            placeholder="Short subtitle for the course"
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <Label>Category</Label>
          <Input
            value={form.category}
            onChange={(e) => onChange('category', e.target.value)}
            placeholder="e.g., Full Stack, Data Science, AI"
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
          {saving ? 'Saving…' : 'Create Course'}
        </button>
        <button
          type="button"
          className="btn btn-outline"
          onClick={reset}
          disabled={saving}
          style={{ height: 40 }}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export default CourseCreateForm;

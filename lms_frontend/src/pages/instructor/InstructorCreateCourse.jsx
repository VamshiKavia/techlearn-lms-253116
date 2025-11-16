import React, { useContext, useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { AuthContext } from '../../providers/AuthProvider';
import { sanitizeString } from '../../utils/sanitize';

// PUBLIC_INTERFACE
export default function InstructorCreateCourse() {
  /** Placeholder for creating a course. */
  const { services } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [created, setCreated] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    const res = await services.courses.create({ title: sanitizeString(title) });
    setCreated(res);
  }

  return (
    <div style={{ maxWidth: 520 }}>
      <h2>Create Course</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <Input label="Course title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <Button type="submit">Create</Button>
      </form>
      {created ? <div style={{ marginTop: 12 }}>Created: {created.title}</div> : null}
    </div>
  );
}

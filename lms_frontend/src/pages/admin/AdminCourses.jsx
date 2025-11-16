import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import Card from '../../components/ui/Card';

// PUBLIC_INTERFACE
export default function AdminCourses() {
  /** Admin courses list placeholder. */
  const { services } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    services.courses.list().then((res) => setCourses(res.items));
  }, [services]);

  return (
    <div>
      <h2>All Courses</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {courses.map((c) => (
          <Card key={c.id}>
            <div style={{ fontWeight: 600 }}>{c.title}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

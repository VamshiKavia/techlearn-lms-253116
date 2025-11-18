import React from 'react';
import { CourseCreateForm } from './CourseCreateForm';

/**
 * PUBLIC_INTERFACE
 * CourseNew
 * Admin page to create a new course via CourseCreateForm.
 * Routed at /admin/courses/new.
 */
export default function CourseNew() {
  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1>New Course</h1>
          <div className="subtitle">Create a new course and set its basic details.</div>
        </div>
        <div aria-hidden="true" />
      </div>

      <section className="card" style={{ padding: 16, borderRadius: 12 }}>
        <CourseCreateForm />
      </section>
    </div>
  );
}

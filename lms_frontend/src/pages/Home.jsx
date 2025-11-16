import React from 'react';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Home() {
  /** Public home with catalog placeholder. */
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h1 style={{ margin: 0 }}>Explore Courses</h1>
      <p style={{ color: 'var(--color-secondary)' }}>
        Browse our catalog. Sign in to enroll and track progress.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {['Full-Stack Development', 'Data Science', 'Cloud & DevOps'].map((title, idx) => (
          <Card key={idx}>
            <div style={{ fontWeight: 700 }}>{title}</div>
            <div style={{ fontSize: 14, color: 'var(--color-secondary)' }}>Coming soon.</div>
          </Card>
        ))}
      </div>
      <div>
        <Link to="/login" className="btn">Login</Link>
        <Link to="/signup" className="btn secondary" style={{ marginLeft: 8 }}>Signup</Link>
      </div>
    </div>
  );
}

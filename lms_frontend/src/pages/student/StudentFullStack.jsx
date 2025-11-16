import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import RatingStars from '../../components/ui/RatingStars';
import ProgressBar from '../../components/ui/ProgressBar';

/**
 * PUBLIC_INTERFACE
 * StudentFullStack shows curated Full-Stack path with grouped sample courses and lessons (mock only).
 * Uses existing UI components and links lesson videos to the LessonPlayer route.
 */
export default function StudentFullStack() {
  const groups = [
    {
      id: 'frontend',
      title: 'Frontend',
      description: 'UI foundations and React essentials.',
      courses: [
        {
          id: 'fs-fe-1',
          title: 'React UI Foundations',
          rating: 4.7,
          progress: 35,
          lessons: [
            { id: 'l1', title: 'JSX & Components', durationMin: 14, courseRef: 'c-fs-1' },
            { id: 'l2', title: 'Props, State & Events', durationMin: 18, courseRef: 'c-fs-1' },
            { id: 'l3', title: 'Hooks Overview', durationMin: 16, courseRef: 'c-fs-1' },
          ],
        },
      ],
    },
    {
      id: 'backend',
      title: 'Backend',
      description: 'API design and services.',
      courses: [
        {
          id: 'fs-be-1',
          title: 'FastAPI Essentials',
          rating: 4.6,
          progress: 10,
          lessons: [
            { id: 'l1', title: 'Project Setup & Routing', durationMin: 20, courseRef: 'c-fs-1' },
            { id: 'l2', title: 'Pydantic Models', durationMin: 12, courseRef: 'c-fs-1' },
            { id: 'l3', title: 'Dependency Injection', durationMin: 15, courseRef: 'c-fs-1' },
          ],
        },
      ],
    },
    {
      id: 'database',
      title: 'Database',
      description: 'Data persistence and modeling.',
      courses: [
        {
          id: 'fs-db-1',
          title: 'MongoDB for Developers',
          rating: 4.5,
          progress: 0,
          lessons: [
            { id: 'l1', title: 'Collections & Documents', durationMin: 12, courseRef: 'c-fs-1' },
            { id: 'l2', title: 'CRUD Operations', durationMin: 18, courseRef: 'c-fs-1' },
            { id: 'l3', title: 'Indexes & Aggregations', durationMin: 20, courseRef: 'c-fs-1' },
          ],
        },
      ],
    },
  ];

  function Group({ group }) {
    return (
      <Card>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontWeight: 800 }}>{group.title}</div>
            <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{group.description}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {group.courses.map((c) => (
              <Card key={c.id}>
                <div style={{ display: 'grid', gap: 8 }}>
                  <div style={{ fontWeight: 700 }}>{c.title}</div>
                  <RatingStars value={c.rating} />
                  <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>Progress</div>
                  <ProgressBar value={c.progress} />
                  <div style={{ fontWeight: 700, marginTop: 6 }}>Video Lessons</div>
                  <ul style={{ display: 'grid', gap: 6 }}>
                    {c.lessons.map((l) => (
                      <li
                        key={l.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 10px',
                          border: '1px solid rgba(17,24,39,0.06)',
                          borderRadius: 8,
                          background: '#fff',
                        }}
                      >
                        <span>
                          {l.title}{' '}
                          <span style={{ fontSize: 12, color: 'var(--color-secondary)' }}>• {l.durationMin}m</span>
                        </span>
                        <Link to={`/student/courses/${l.courseRef}/lessons/${l.id}`} className="btn ghost">
                          Play
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h1 style={{ margin: 0 }}>Full-Stack Path</h1>
        <p style={{ color: 'var(--color-secondary)', marginTop: 6 }}>
          Explore curated Frontend, Backend, and Database courses with hands-on video lessons.
        </p>
      </div>

      {groups.map((g) => (
        <Group key={g.id} group={g} />
      ))}
    </div>
  );
}

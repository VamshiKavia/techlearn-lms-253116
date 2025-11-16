import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import RatingStars from '../../components/ui/RatingStars';
import ProgressBar from '../../components/ui/ProgressBar';

/**
 * PUBLIC_INTERFACE
 * StudentDataScience shows curated DS path with grouped sample topics and links to the existing lesson player (mock).
 */
export default function StudentDataScience() {
  const tracks = [
    {
      id: 'py',
      title: 'Python for Data',
      rating: 4.6,
      progress: 42,
      lessons: [
        { id: 'l1', title: 'NumPy Arrays Primer', durationMin: 15, courseRef: 'c-ds-1' },
        { id: 'l2', title: 'Pandas Series & DataFrames', durationMin: 20, courseRef: 'c-ds-1' },
        { id: 'l3', title: 'Data Cleaning Patterns', durationMin: 18, courseRef: 'c-ds-1' },
      ],
    },
    {
      id: 'viz',
      title: 'Visualization',
      rating: 4.5,
      progress: 18,
      lessons: [
        { id: 'l4', title: 'Matplotlib Basics', durationMin: 12, courseRef: 'c-ds-1' },
        { id: 'l5', title: 'Seaborn for Exploratory Plots', durationMin: 16, courseRef: 'c-ds-1' },
      ],
    },
    {
      id: 'ml',
      title: 'Intro to ML',
      rating: 4.4,
      progress: 0,
      lessons: [
        { id: 'l6', title: 'Supervised vs Unsupervised', durationMin: 14, courseRef: 'c-ds-1' },
        { id: 'l7', title: 'Train/Test Split & Metrics', durationMin: 17, courseRef: 'c-ds-1' },
      ],
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h1 style={{ margin: 0 }}>Data Science Path</h1>
        <p style={{ color: 'var(--color-secondary)', marginTop: 6 }}>
          Learn Python for Data, Visualization, and foundational Machine Learning with hands-on video lessons.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {tracks.map((t) => (
          <Card key={t.id}>
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ fontWeight: 700 }}>{t.title}</div>
              <RatingStars value={t.rating} />
              <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>Progress</div>
              <ProgressBar value={t.progress} />
              <div style={{ fontWeight: 700, marginTop: 6 }}>Video Lessons</div>
              <ul style={{ display: 'grid', gap: 6 }}>
                {t.lessons.map((l) => (
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
  );
}

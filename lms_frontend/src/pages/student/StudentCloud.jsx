import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import RatingStars from '../../components/ui/RatingStars';
import ProgressBar from '../../components/ui/ProgressBar';

/**
 * PUBLIC_INTERFACE
 * StudentCloud shows curated Cloud path (AWS/Azure/GCP fundamentals) with mock courses and lessons that route to LessonPlayer.
 */
export default function StudentCloud() {
  const tracks = [
    {
      id: 'aws',
      title: 'AWS Core Services',
      rating: 4.6,
      progress: 22,
      lessons: [
        { id: 'l1', title: 'IAM Basics', durationMin: 12, courseRef: 'c-cloud-1' },
        { id: 'l2', title: 'Compute with EC2', durationMin: 18, courseRef: 'c-cloud-1' },
        { id: 'l3', title: 'Storage with S3', durationMin: 16, courseRef: 'c-cloud-1' },
      ],
    },
    {
      id: 'azure',
      title: 'Azure Fundamentals',
      rating: 4.4,
      progress: 10,
      lessons: [
        { id: 'l4', title: 'Resource Groups & RBAC', durationMin: 15, courseRef: 'c-cloud-1' },
        { id: 'l5', title: 'Compute with VM Scale Sets', durationMin: 14, courseRef: 'c-cloud-1' },
      ],
    },
    {
      id: 'gcp',
      title: 'GCP Essentials',
      rating: 4.3,
      progress: 0,
      lessons: [
        { id: 'l6', title: 'Projects, Billing & IAM', durationMin: 12, courseRef: 'c-cloud-1' },
        { id: 'l7', title: 'Compute Engine Basics', durationMin: 16, courseRef: 'c-cloud-1' },
      ],
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h1 style={{ margin: 0 }}>Cloud Path</h1>
        <p style={{ color: 'var(--color-secondary)', marginTop: 6 }}>
          Learn core AWS, Azure, and GCP services with short, practical video lessons.
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

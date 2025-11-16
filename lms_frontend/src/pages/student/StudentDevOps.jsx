import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import RatingStars from '../../components/ui/RatingStars';
import ProgressBar from '../../components/ui/ProgressBar';

/**
 * PUBLIC_INTERFACE
 * StudentDevOps shows curated DevOps path (Git, CI/CD, Docker/Kubernetes) with mock lessons that open the existing LessonPlayer.
 */
export default function StudentDevOps() {
  const groups = [
    {
      id: 'git',
      title: 'Git & GitHub',
      rating: 4.7,
      progress: 40,
      lessons: [
        { id: 'l1', title: 'Git Basics & Workflow', durationMin: 14, courseRef: 'c-devops-1' },
        { id: 'l2', title: 'Branching Strategies', durationMin: 16, courseRef: 'c-devops-1' },
      ],
    },
    {
      id: 'cicd',
      title: 'CI/CD Foundations',
      rating: 4.8,
      progress: 18,
      lessons: [
        { id: 'l3', title: 'Pipelines & Runners', durationMin: 18, courseRef: 'c-devops-1' },
        { id: 'l4', title: 'Tests & Quality Gates', durationMin: 15, courseRef: 'c-devops-1' },
      ],
    },
    {
      id: 'containers',
      title: 'Docker & Kubernetes',
      rating: 4.8,
      progress: 5,
      lessons: [
        { id: 'l5', title: 'Docker Images & Containers', durationMin: 17, courseRef: 'c-devops-1' },
        { id: 'l6', title: 'K8s Pods, Deployments & Services', durationMin: 20, courseRef: 'c-devops-1' },
      ],
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h1 style={{ margin: 0 }}>DevOps Path</h1>
        <p style={{ color: 'var(--color-secondary)', marginTop: 6 }}>
          Master Git, CI/CD pipelines, and container orchestration with Docker & Kubernetes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {groups.map((g) => (
          <Card key={g.id}>
            <div style={{ display: 'grid', gap: 8 }}>
              <div style={{ fontWeight: 700 }}>{g.title}</div>
              <RatingStars value={g.rating} />
              <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>Progress</div>
              <ProgressBar value={g.progress} />
              <div style={{ fontWeight: 700, marginTop: 6 }}>Video Lessons</div>
              <ul style={{ display: 'grid', gap: 6 }}>
                {g.lessons.map((l) => (
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

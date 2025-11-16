import React from 'react';
import Card from '../../components/ui/Card';
import MetricCard from '../../components/ui/MetricCard';
import LineChart from '../../components/ui/LineChart';
import ProgressBar from '../../components/ui/ProgressBar';

/**
 * PUBLIC_INTERFACE
 * StudentMyLearning shows detailed learning progress for key tracks using mock data.
 * Includes track progress, enrolled modules, next lessons, and badges. No backend calls.
 */
export default function StudentMyLearning() {
  // Mock data for two tracks
  const tracks = [
    {
      id: 'fs',
      title: 'Full-Stack Development',
      progress: 62,
      nextLesson: { module: 'Frontend Basics', lesson: 'React Components 101' },
      modules: [
        { id: 'm1', title: 'HTML & CSS Fundamentals', completed: true, progress: 100 },
        { id: 'm2', title: 'JavaScript Essentials', completed: true, progress: 100 },
        { id: 'm3', title: 'Frontend Basics (React)', completed: false, progress: 45 },
        { id: 'm4', title: 'Backend with Node.js & Express', completed: false, progress: 15 },
        { id: 'm5', title: 'Databases & ORMs', completed: false, progress: 0 },
      ],
      progressTrend: [20, 25, 28, 35, 40, 44, 49, 52, 55, 58, 60, 62],
      badges: [
        { id: 'b1', label: 'JS Fundamentals', color: 'var(--color-success)' },
        { id: 'b2', label: 'HTML/CSS Pro', color: 'var(--color-primary)' },
      ],
    },
    {
      id: 'ds',
      title: 'Data Science',
      progress: 38,
      nextLesson: { module: 'Python for Data', lesson: 'Pandas DataFrames' },
      modules: [
        { id: 'm1', title: 'Python Foundations', completed: true, progress: 100 },
        { id: 'm2', title: 'Statistics Basics', completed: false, progress: 30 },
        { id: 'm3', title: 'Python for Data (Pandas, NumPy)', completed: false, progress: 15 },
        { id: 'm4', title: 'Data Visualization', completed: false, progress: 0 },
        { id: 'm5', title: 'Intro to ML', completed: false, progress: 0 },
      ],
      progressTrend: [10, 12, 15, 17, 20, 23, 26, 28, 31, 34, 36, 38],
      badges: [
        { id: 'b3', label: 'Python Starter', color: 'var(--color-primary)' },
        { id: 'b4', label: 'Stats Apprentice', color: 'var(--color-secondary)' },
      ],
    },
  ];

  function ModuleItem({ mod }) {
    return (
      <li
        style={{
          display: 'grid',
          gap: 6,
          padding: 10,
          border: '1px solid rgba(17,24,39,0.06)',
          borderRadius: 8,
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 600 }}>{mod.title}</span>
          <span style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
            {mod.completed ? 'Completed' : `${mod.progress}%`}
          </span>
        </div>
        <ProgressBar value={mod.progress} />
      </li>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h1 style={{ margin: 0 }}>My Learning</h1>
        <p style={{ color: 'var(--color-secondary)', marginTop: 6 }}>
          Continue your tracks and see what’s next.
        </p>
      </div>

      {/* Overview metrics */}
      <div
        aria-label="learning-metrics"
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        }}
      >
        <MetricCard label="Active Tracks" value={tracks.length} hint="Currently enrolled" />
        <MetricCard label="Badges Earned" value={tracks.reduce((acc, t) => acc + t.badges.length, 0)} hint="Across tracks" />
        <MetricCard label="Avg. Progress" value={`${Math.round(tracks.reduce((a, t) => a + t.progress, 0) / tracks.length)}%`} hint="Across active tracks" />
      </div>

      {/* Each track detail */}
      {tracks.map((t) => (
        <Card key={t.id}>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'grid', gap: 6 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{t.title}</div>
                <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>Overall Progress</div>
                <ProgressBar value={t.progress} />
              </div>
              <div style={{ minWidth: 260 }}>
                <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>Next Up</div>
                <div style={{ fontWeight: 600 }}>
                  {t.nextLesson.module} — {t.nextLesson.lesson}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr' }}>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Enrolled Modules</div>
                <ul style={{ display: 'grid', gap: 8 }}>
                  {t.modules.map((m) => (
                    <ModuleItem key={m.id} mod={m} />
                  ))}
                </ul>
              </div>

              <div style={{ display: 'grid', gap: 12 }}>
                <Card>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 700 }}>Progress Trend</div>
                    <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>Last 12 weeks</div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <LineChart data={t.progressTrend} label={`${t.title} progress line chart`} />
                  </div>
                </Card>

                <Card>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>Badges</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {t.badges.map((b) => (
                      <span
                        key={b.id}
                        style={{
                          fontSize: 12,
                          color: '#fff',
                          background: b.color,
                          padding: '6px 10px',
                          borderRadius: 999,
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        {b.label}
                      </span>
                    ))}
                    {t.badges.length === 0 ? (
                      <span style={{ fontSize: 12, color: 'var(--color-secondary)' }}>No badges yet</span>
                    ) : null}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

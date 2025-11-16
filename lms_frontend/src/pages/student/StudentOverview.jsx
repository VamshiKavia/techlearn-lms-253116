import React from 'react';
import MetricCard from '../../components/ui/MetricCard';
import Card from '../../components/ui/Card';
import LineChart from '../../components/ui/LineChart';
import BarChart from '../../components/ui/BarChart';

// PUBLIC_INTERFACE
export default function StudentOverview() {
  /** Student Overview dashboard with mock metrics, charts, and recent activity. No backend calls. */
  const metrics = [
    { label: 'Enrolled Courses', value: '5', trend: 2.1, hint: 'vs last month' },
    { label: 'Active Courses', value: '3', trend: 0.0, hint: 'currently learning' },
    { label: 'Completed Courses', value: '8', trend: 6.5, hint: 'lifetime' },
    { label: 'Avg. Progress', value: '54%', trend: 1.2, hint: 'across active courses' },
    { label: 'Weekly Study Time', value: '6.5h', trend: -0.8, hint: 'last 7 days' },
  ];

  const progressTrend = [30, 32, 34, 36, 40, 42, 45, 47, 50, 52, 53, 54];
  const courseDistribution = [3, 2, 1, 4]; // sample per category
  const categories = ['Web Dev', 'Data', 'Cloud', 'Testing'];

  const recentActivity = [
    { id: 'a1', title: 'Completed: Module 3 - React Hooks', when: '2h ago' },
    { id: 'a2', title: 'Watched: Kubernetes Basics Lesson 2', when: '1d ago' },
    { id: 'a3', title: 'Quiz Passed: Python Loops', when: '3d ago' },
    { id: 'a4', title: 'Resumed: Git & GitHub Essentials', when: '5d ago' },
  ];

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h1 style={{ margin: 0 }}>Student Overview</h1>
        <p style={{ color: 'var(--color-secondary)', marginTop: 6 }}>
          Track your learning at a glance and continue where you left off.
        </p>
      </div>

      <div
        aria-label="student-metrics"
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        }}
      >
        {metrics.map((m) => (
          <MetricCard key={m.label} label={m.label} value={m.value} trend={m.trend} hint={m.hint} />
        ))}
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontWeight: 700 }}>Progress Trend</div>
            <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>Last 12 weeks</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <LineChart data={progressTrend} label="Progress Trend line chart" />
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontWeight: 700 }}>Course Distribution</div>
            <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>By category</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <BarChart data={courseDistribution} label="Course Distribution bar chart" />
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {categories.map((c, i) => (
              <span
                key={c}
                style={{
                  fontSize: 12,
                  color: 'var(--color-secondary)',
                  background: 'rgba(17,24,39,0.04)',
                  padding: '4px 8px',
                  borderRadius: 6,
                }}
              >
                {c}: {courseDistribution[i] || 0}
              </span>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr' }}>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Recent Activity</div>
          <ul style={{ display: 'grid', gap: 8 }}>
            {recentActivity.map((a) => (
              <li key={a.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{a.title}</span>
                <span style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{a.when}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Tips</div>
          <div style={{ fontSize: 14, color: 'var(--color-secondary)' }}>
            Keep a steady weekly cadence. Aim for at least 5 hours of focused study each week.
          </div>
        </Card>
      </div>
    </div>
  );
}

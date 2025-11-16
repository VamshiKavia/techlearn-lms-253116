import React from 'react';
import MetricCard from '../../components/ui/MetricCard';
import Card from '../../components/ui/Card';
import LineChart from '../../components/ui/LineChart';
import BarChart from '../../components/ui/BarChart';

// PUBLIC_INTERFACE
export default function InstructorOverview() {
  /** Instructor Overview dashboard with mock KPI metrics and simple charts. No backend calls. */
  const metrics = [
    { label: 'Active Courses', value: '4', trend: 1.5, hint: 'currently published' },
    { label: 'Total Enrollments', value: '1,245', trend: 3.8, hint: 'across all courses' },
    { label: 'Monthly Revenue', value: '$4,320', trend: 2.4, hint: 'last 30 days' },
    { label: 'Avg. Rating', value: '4.6', trend: 0.0, hint: 'weighted average' },
    { label: 'Completion Rate', value: '71%', trend: 0.9, hint: 'rolling 12 weeks' },
  ];

  const enrollmentsTrend = [45, 50, 48, 60, 62, 70, 68, 75, 80, 78, 85, 92];
  const completionTrend = [60, 62, 63, 64, 66, 68, 67, 69, 70, 71, 71, 72];
  const courseEnrollments = [320, 240, 180, 150, 120];

  const recentReviews = [
    { id: 'r1', course: 'React Fundamentals', rating: 5, comment: 'Great explanations!', when: '2d ago' },
    { id: 'r2', course: 'Docker & Kubernetes', rating: 4, comment: 'Very informative', when: '4d ago' },
    { id: 'r3', course: 'Python for Data Science', rating: 5, comment: 'Loved the examples', when: '6d ago' },
  ];

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h1 style={{ margin: 0 }}>Instructor Overview</h1>
        <p style={{ color: 'var(--color-secondary)', marginTop: 6 }}>
          Monitor course performance, engagement, and outcomes.
        </p>
      </div>

      <div
        aria-label="instructor-metrics"
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
            <div style={{ fontWeight: 700 }}>Monthly Enrollments</div>
            <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>Last 12 months</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <LineChart data={enrollmentsTrend} label="Monthly Enrollments line chart" />
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontWeight: 700 }}>Completion Rate</div>
            <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>Last 12 months</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <LineChart data={completionTrend} color="var(--color-success)" label="Completion Rate line chart" />
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontWeight: 700 }}>Top Courses by Enrollment</div>
            <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>This quarter</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <BarChart data={courseEnrollments} label="Top Courses bar chart" />
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Recent Reviews</div>
          <ul style={{ display: 'grid', gap: 8 }}>
            {recentReviews.map((r) => (
              <li key={r.id} style={{ display: 'grid', gap: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>{r.course}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{r.when}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
                  {'★'.repeat(r.rating)}{' '}
                  <span style={{ marginLeft: 6 }}>{r.comment}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

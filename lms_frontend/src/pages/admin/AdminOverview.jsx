import React from 'react';
import MetricCard from '../../components/ui/MetricCard';
import Card from '../../components/ui/Card';
import LineChart from '../../components/ui/LineChart';
import BarChart from '../../components/ui/BarChart';

// PUBLIC_INTERFACE
export default function AdminOverview() {
  /** Admin Overview dashboard with mock KPI metrics and simple charts. No backend calls. */
  const metrics = [
    { label: 'Total Users', value: '12,430', trend: 3.2, hint: 'vs last 30 days' },
    { label: 'Active Learners', value: '2,145', trend: 1.1, hint: 'weekly active' },
    { label: 'Courses', value: '86', trend: 0.0, hint: 'published' },
    { label: 'Enrollments', value: '28,902', trend: 5.6, hint: 'lifetime' },
    { label: 'Completion Rate', value: '62%', trend: -0.7, hint: 'rolling 30 days' },
  ];

  const enrollmentsTrend = [120, 130, 128, 140, 160, 180, 175, 190, 210, 205, 230, 245];
  const completionsTrend = [60, 62, 61, 63, 64, 66, 65, 67, 66, 68, 69, 70];
  const topCategories = [320, 280, 260, 210, 160, 120];

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h1 style={{ margin: 0 }}>Admin Overview</h1>
        <p style={{ color: 'var(--color-secondary)', marginTop: 6 }}>
          Platform health and learning activity at a glance.
        </p>
      </div>

      <div
        aria-label="metrics"
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
            <LineChart data={completionsTrend} color="var(--color-success)" label="Completion Rate line chart" />
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div style={{ fontWeight: 700 }}>Top Categories by Enrollment</div>
            <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>This quarter</div>
          </div>
          <div style={{ marginTop: 8 }}>
            <BarChart data={topCategories} label="Top Categories bar chart" />
          </div>
        </Card>

        <Card>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Announcements</div>
          <div style={{ fontSize: 14, color: 'var(--color-secondary)' }}>
            No new announcements. Use the Admin tools to create platform notices.
          </div>
        </Card>
      </div>
    </div>
  );
}

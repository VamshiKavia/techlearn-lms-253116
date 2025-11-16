import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import MetricCard from '../../components/ui/MetricCard';
import Button from '../../components/ui/Button';

/**
 * PUBLIC_INTERFACE
 * AdminOverview - Minimal metrics, compact recent activity, and quick links; no complex charts.
 */
const AdminOverview = () => {
  const metrics = [
    { label: 'Users', value: '1,240', trend: '' },
    { label: 'Instructors', value: '18', trend: '' },
    { label: 'Courses', value: '96', trend: '' },
    { label: 'Enrollments', value: '4,305', trend: '' },
  ];

  const recent = [
    { id: 'r1', text: 'New user registered: jane@dev.co' },
    { id: 'r2', text: 'Course published: Advanced React' },
    { id: 'r3', text: 'Enrollment: tom@qa.com -> DevOps Fundamentals' },
  ];

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Overview</h1>
        <p className="text-gray-500">Platform snapshot and quick actions.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.label} label={m.label} value={m.value} trend={m.trend} />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-2">Recent activity</h2>
          <ul className="text-sm text-gray-700 space-y-2">
            {recent.map((r) => (
              <li key={r.id} className="border-b last:border-0 pb-2">{r.text}</li>
            ))}
          </ul>
        </Card>
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-gray-800">Quick links</h2>
            <Link to="/admin/users">
              <Button variant="primary">Manage Users</Button>
            </Link>
          </div>
          <div className="flex gap-2">
            <Link to="/admin/courses">
              <Button variant="secondary">Courses</Button>
            </Link>
            <Link to="/admin/enrollments">
              <Button variant="secondary">Enrollments</Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default AdminOverview;

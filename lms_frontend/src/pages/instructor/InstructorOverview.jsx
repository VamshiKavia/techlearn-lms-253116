import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import MetricCard from '../../components/ui/MetricCard';
import Button from '../../components/ui/Button';
import { getMockInstructorCourses, getMockInstructorSubmissions } from '../../services/mockData';

/**
 * PUBLIC_INTERFACE
 * InstructorOverview - Minimal KPI view and quick links for instructors (mock only).
 */
const InstructorOverview = () => {
  const myCourses = useMemo(() => getMockInstructorCourses(), []);
  const submissions = useMemo(() => getMockInstructorSubmissions(), []);

  const kpis = [
    { label: 'My Courses', value: myCourses.length, trend: '' },
    {
      label: 'Active Enrollments',
      value: myCourses.reduce((acc, c) => acc + (c.enrollments || 0), 0),
      trend: '',
    },
    {
      label: 'Pending Submissions',
      value: submissions.filter((s) => s.status === 'Submitted').length,
      trend: '',
    },
  ];

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Overview</h1>
        <p className="text-gray-500">Your teaching snapshot.</p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((k) => (
          <MetricCard key={k.label} label={k.label} value={String(k.value)} trend={k.trend} />
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-medium text-gray-800">Quick links</h2>
            <Link to="/instructor/courses/create">
              <Button variant="primary">Create Course</Button>
            </Link>
          </div>
          <div className="flex gap-2">
            <Link to="/instructor/courses">
              <Button variant="secondary">My Courses</Button>
            </Link>
            <Link to="/instructor/submissions">
              <Button variant="secondary">Submissions</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-medium text-gray-800 mb-2">Getting started</h2>
          <div className="text-sm text-gray-600">
            Keep lessons concise and add assignments for engagement.
          </div>
        </Card>
      </section>
    </div>
  );
};

export default InstructorOverview;

import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import MetricCard from '../../components/ui/MetricCard';
import LineChart from '../../components/ui/LineChart';
import BarChart from '../../components/ui/BarChart';
import RatingStars from '../../components/ui/RatingStars';
import Button from '../../components/ui/Button';
import { getAdminOverview, getIntegratedQuickLinks } from '../../services/adminService';

// PUBLIC_INTERFACE
export default function AdminOverview() {
  /** Admin Overview page with integrated metrics, charts and quick links. */
  const { metrics, progress, latestCourses, topRated } = getAdminOverview();
  const quickLinks = getIntegratedQuickLinks();

  const progressSeries = [
    {
      id: 'Avg Progress',
      data: Object.values(progress.byCourse).map((c, idx) => ({
        x: `C${idx + 1}`,
        y: c.avgProgress,
      })),
    },
  ];
  const enrollmentSeries = [
    {
      id: 'Enrollments',
      data: Object.values(progress.byCourse).map((c, idx) => ({
        x: `C${idx + 1}`,
        y: c.learners,
      })),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Admin Overview</h1>
        <div className="flex gap-2">
          {quickLinks.map((q) => (
            <Link key={q.to} to={q.to}>
              <Button variant="secondary">{q.label}</Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Total Users" value={metrics.usersTotal} />
        <MetricCard label="Courses" value={`${metrics.coursesTotal} (${metrics.coursesPublished} published)`} />
        <MetricCard label="Enrollments" value={metrics.enrollmentsTotal} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Average Progress by Course">
          <div className="h-56">
            <LineChart series={progressSeries} />
          </div>
        </Card>
        <Card title="Enrollments by Course">
          <div className="h-56">
            <BarChart series={enrollmentSeries} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Latest Updated Courses">
          <div className="grid grid-cols-1 gap-3">
            {latestCourses.length === 0 ? (
              <div className="text-gray-500">No courses available.</div>
            ) : latestCourses.map((c) => (
              <div key={c.id} className="flex items-center justify-between border rounded p-3 bg-white">
                <div>
                  <div className="font-medium text-gray-800">{c.title}</div>
                  <div className="text-xs text-gray-500">{c.category} • {c.instructorName || 'Instructor'}</div>
                </div>
                <div className="flex items-center gap-3">
                  <RatingStars value={c.rating || 0} />
                  <span className={`text-xs ${c.published ? 'text-green-600' : 'text-gray-500'}`}>
                    {c.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Top Rated Courses">
          <div className="grid grid-cols-1 gap-3">
            {topRated.length === 0 ? (
              <div className="text-gray-500">No courses available.</div>
            ) : topRated.map((c) => (
              <div key={c.id} className="flex items-center justify-between border rounded p-3 bg-white">
                <div>
                  <div className="font-medium text-gray-800">{c.title}</div>
                  <div className="text-xs text-gray-500">{c.category} • {c.instructorName || 'Instructor'}</div>
                </div>
                <div className="flex items-center gap-3">
                  <RatingStars value={c.rating || 0} />
                  <span className={`text-xs ${c.published ? 'text-green-600' : 'text-gray-500'}`}>
                    {c.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { getMockInstructorCourses } from '../../services/mockData';

/**
 * PUBLIC_INTERFACE
 * InstructorCourses - Minimal instructor-owned course list with status, enrollments and quick actions.
 */
const InstructorCourses = () => {
  const courses = useMemo(() => getMockInstructorCourses(), []);

  return (
    <div className="space-y-10">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">My Courses</h1>
          <p className="text-gray-500">Manage the courses you own.</p>
        </div>
        <Link to="/instructor/courses/create">
          <Button variant="primary">Create Course</Button>
        </Link>
      </section>

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 border-b">
          <div className="col-span-5 p-3 text-sm text-gray-600">Course</div>
          <div className="col-span-2 p-3 text-sm text-gray-600">Status</div>
          <div className="col-span-2 p-3 text-sm text-gray-600">Enrollments</div>
          <div className="col-span-3 p-3 text-sm text-gray-600 text-right">Actions</div>
        </div>
        {courses.length === 0 ? (
          <EmptyState title="No courses yet" subtitle="Create your first course to get started." />
        ) : (
          courses.map((c) => (
            <div key={c.id} className="grid grid-cols-12 border-b last:border-0">
              <div className="col-span-5 p-3 text-gray-800">{c.title}</div>
              <div className="col-span-2 p-3">
                <span
                  className={
                    'inline-flex items-center px-2 py-0.5 rounded text-xs ' +
                    (c.status === 'Published'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-700')
                  }
                >
                  {c.status}
                </span>
              </div>
              <div className="col-span-2 p-3 text-gray-800">{c.enrollments || 0}</div>
              <div className="col-span-3 p-3 text-right space-x-2">
                <Link to={`/instructor/courses/${c.id}/edit`}>
                  <Button size="sm" variant="secondary">
                    Edit
                  </Button>
                </Link>
                <Link to={`/courses/${c.id}`}>
                  <Button size="sm" variant="primary">
                    View as Student
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};

export default InstructorCourses;

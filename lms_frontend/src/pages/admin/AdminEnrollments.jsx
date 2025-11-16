import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import ProgressBar from '../../components/ui/ProgressBar';
import { getAdminEnrollments } from '../../services/adminService';
import { mockCourses } from '../../services/mockData';

/**
 * PUBLIC_INTERFACE
 * AdminEnrollments page shows enrollment list with progress snapshot and filters.
 */
const AdminEnrollments = () => {
  const [search, setSearch] = useState('');
  const [courseId, setCourseId] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { items, total } = useMemo(
    () =>
      getAdminEnrollments({
        search: search || undefined,
        courseId: courseId === 'All' ? undefined : courseId,
        page,
        pageSize,
      }),
    [search, courseId, page]
  );

  const courseOptions = ['All', ...mockCourses.map((c) => c.id)];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-800">Enrollments & Progress</h1>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-600">Search student</label>
            <Input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search by name or email"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Course</label>
            <select
              className="border rounded px-3 py-2 text-gray-700 w-full"
              value={courseId}
              onChange={(e) => {
                setPage(1);
                setCourseId(e.target.value);
              }}
            >
              {courseOptions.map((id) => (
                <option key={id} value={id}>
                  {id === 'All' ? 'All Courses' : mockCourses.find((c) => c.id === id)?.title || id}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card title={`Enrollments (${total})`}>
        {items.length === 0 ? (
          <EmptyState title="No enrollments" description="Try adjusting filters." />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {items.map((e) => (
              <div key={`${e.userId}-${e.courseId}`} className="border rounded p-3 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">
                      {e.userName}{' '}
                      <span className="text-xs text-gray-500">({e.userEmail})</span>{' '}
                      <span className="text-xs text-gray-500">• {e.userRole}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <Link className="underline hover:text-gray-800" to="/admin/courses">
                        {e.courseTitle}
                      </Link>{' '}
                      ({e.courseCategory}) • <span className={e.status === 'active' ? 'text-green-600' : 'text-gray-500'}>{e.status}</span>{' '}
                      • Enrolled {new Date(e.enrolled_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{e.progress}%</div>
                </div>
                <div className="mt-2">
                  <ProgressBar value={e.progress} />
                </div>
                <div className="mt-2 text-xs text-gray-600 flex gap-3">
                  <Link className="underline hover:text-gray-800" to={`/admin/users#${e.userId}`}>View profile</Link>
                  <Link className="underline hover:text-gray-800" to="/admin/courses">Open course</Link>
                  <Link className="underline hover:text-gray-800" to={`/student/mylearning?course=${e.courseId}`}>Open as student</Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <Pagination
            currentPage={page}
            pageSize={pageSize}
            totalItems={total}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </Card>
    </div>
  );
};

export default AdminEnrollments;

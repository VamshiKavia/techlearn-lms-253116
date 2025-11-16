import React, { useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import ProgressBar from '../../components/ui/ProgressBar';
import { getAdminEnrollments } from '../../services/adminService';

/**
 * PUBLIC_INTERFACE
 * AdminEnrollments page shows enrollment list with progress snapshot.
 */
const AdminEnrollments = () => {
  const [userId, setUserId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { items, total } = useMemo(
    () => getAdminEnrollments({
      userId: userId || undefined,
      courseId: courseId || undefined,
      page,
      pageSize
    }),
    [userId, courseId, page]
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-800">Enrollments & Progress</h1>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm text-gray-600">Filter by User ID</label>
            <Input value={userId} onChange={(e) => { setPage(1); setUserId(e.target.value); }} placeholder="e.g. u_123" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Filter by Course ID</label>
            <Input value={courseId} onChange={(e) => { setPage(1); setCourseId(e.target.value); }} placeholder="e.g. c_101" />
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
                    <div className="font-medium text-gray-800">{e.userName} • <span className="text-xs text-gray-500">{e.userRole}</span></div>
                    <div className="text-xs text-gray-500">{e.courseTitle} ({e.courseCategory})</div>
                  </div>
                  <div className="text-sm text-gray-600">{e.progress}%</div>
                </div>
                <div className="mt-2">
                  <ProgressBar value={e.progress} />
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

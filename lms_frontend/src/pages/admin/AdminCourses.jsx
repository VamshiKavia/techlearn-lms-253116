import React, { useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import RatingStars from '../../components/ui/RatingStars';
import { getAdminCourses, toggleCoursePublish } from '../../services/adminService';

// PUBLIC_INTERFACE
export default function AdminCourses() {
  /** Admin Courses management with mock search/filter and publish toggling. */
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { items, total } = useMemo(
    () => getAdminCourses({ query, status, page, pageSize }),
    [query, status, page]
  );

  const statuses = ['All', 'Published', 'Unpublished'];

  const handleToggle = (courseId) => {
    toggleCoursePublish(courseId);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-800">Courses</h1>

      <Card>
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1">
            <label className="text-sm text-gray-600">Search</label>
            <Input value={query} onChange={(e) => { setPage(1); setQuery(e.target.value); }} placeholder="Search by title, category, instructor" />
          </div>
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <select
              className="border rounded px-3 py-2 text-gray-700"
              value={status}
              onChange={(e) => { setPage(1); setStatus(e.target.value); }}
            >
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <Button onClick={() => { setQuery(''); setStatus('All'); setPage(1); }} variant="secondary">Reset</Button>
        </div>
      </Card>

      <Card title={`Courses (${total})`}>
        {items.length === 0 ? (
          <EmptyState title="No courses found" description="Try adjusting your filters or search keyword." />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {items.map((c) => (
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
                  <Button size="sm" onClick={() => handleToggle(c.id)} variant={c.published ? 'secondary' : 'primary'}>
                    {c.published ? 'Unpublish' : 'Publish'}
                  </Button>
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
}

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';
import RatingStars from '../../components/ui/RatingStars';
import ProgressBar from '../../components/ui/ProgressBar';
import { getAdminCourses, toggleCoursePublish, getEnrollmentsForCourse } from '../../services/adminService';

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
              <CourseRow key={c.id} course={c} onToggle={handleToggle} />
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

/**
 * Course row with expandable enrolled students list.
 */
function CourseRow({ course, onToggle }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const learners = useMemo(() => {
    const list = getEnrollmentsForCourse(course.id);
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter(
      (e) => (e.userName || '').toLowerCase().includes(s) || (e.userEmail || '').toLowerCase().includes(s)
    );
  }, [course.id, q]);

  return (
    <div className="border rounded bg-white">
      <div className="flex items-center justify-between p-3">
        <div>
          <div className="font-medium text-gray-800">{course.title}</div>
          <div className="text-xs text-gray-500">
            {course.category} • {course.instructorName || 'Instructor'}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RatingStars value={course.rating || 0} />
          <span className={`text-xs ${course.published ? 'text-green-600' : 'text-gray-500'}`}>
            {course.published ? 'Published' : 'Draft'}
          </span>
          <Button size="sm" onClick={() => onToggle(course.id)} variant={course.published ? 'secondary' : 'primary'}>
            {course.published ? 'Unpublish' : 'Publish'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setOpen(!open)} ariaLabel="Toggle enrolled students">
            {open ? 'Hide Students' : 'View Students'}
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-t p-3 bg-gray-50">
          <div className="flex items-end gap-3 mb-3">
            <div className="flex-1">
              <label className="text-sm text-gray-600">Search student</label>
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email" />
            </div>
            <Link className="text-sm underline hover:text-gray-800" to={`/student/mylearning?course=${course.id}`}>
              Open as student
            </Link>
          </div>
          {learners.length === 0 ? (
            <EmptyState title="No enrolled students" description="Try a different search." />
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {learners.map((e) => (
                <div key={`${e.userId}-${e.courseId}`} className="bg-white border rounded p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">
                        {e.userName} <span className="text-xs text-gray-500">({e.userEmail})</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {course.title} • <span className={e.status === 'active' ? 'text-green-600' : 'text-gray-500'}>{e.status}</span> • Enrolled{' '}
                        {new Date(e.enrolled_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{e.progress}%</div>
                  </div>
                  <div className="mt-2">
                    <ProgressBar value={e.progress} />
                  </div>
                  <div className="mt-2 text-xs text-gray-600 flex gap-3">
                    <Link className="underline hover:text-gray-800" to={`/admin/users#${e.userId}`}>
                      View profile
                    </Link>
                    <Link className="underline hover:text-gray-800" to="/admin/courses">
                      Open course
                    </Link>
                    <Link className="underline hover:text-gray-800" to={`/student/mylearning?course=${e.courseId}`}>
                      Open as student
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import EmptyState from '../../components/ui/EmptyState';

/**
 * PUBLIC_INTERFACE
 * AdminCourses - Minimal course list with simple search/filter and publish toggle (mock).
 */
const initialCourses = [
  { id: 'c1', title: 'Intro to Testing', status: 'Published', category: 'Software Testing', enrollments: 132 },
  { id: 'c2', title: 'React for Beginners', status: 'Draft', category: 'Full-Stack', enrollments: 0 },
  { id: 'c3', title: 'DevOps Fundamentals', status: 'Published', category: 'DevOps', enrollments: 252 },
];

const AdminCourses = () => {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [courses, setCourses] = useState(initialCourses);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return courses.filter((c) => {
      const matchesQ = c.title.toLowerCase().includes(term);
      const matchesF = filter === 'all' ? true : c.status.toLowerCase() === filter;
      return matchesQ && matchesF;
    });
  }, [q, filter, courses]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = filtered.slice((page - 1) * pageSize, page * pageSize);

  const togglePublish = (id) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'Published' ? 'Draft' : 'Published' } : c
      )
    );
  };

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Courses</h1>
        <p className="text-gray-500">Manage all courses on the platform.</p>
      </section>

      <Card>
        <div className="flex items-center gap-3 mb-3">
          <Input placeholder="Search courses" value={q} onChange={(e) => setQ(e.target.value)} />
          <select
            className="border rounded px-2 py-2 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="grid grid-cols-12 bg-gray-50 border-b">
          <div className="col-span-5 p-3 text-sm text-gray-600">Course</div>
          <div className="col-span-2 p-3 text-sm text-gray-600">Status</div>
          <div className="col-span-2 p-3 text-sm text-gray-600">Enrollments</div>
          <div className="col-span-3 p-3 text-sm text-gray-600 text-right">Actions</div>
        </div>
        {current.length === 0 ? (
          <EmptyState title="No courses found" subtitle="Try a different search or filter." />
        ) : (
          current.map((c) => (
            <div key={c.id} className="grid grid-cols-12 border-b last:border-0">
              <div className="col-span-5 p-3 text-gray-800">
                <div className="font-medium">{c.title}</div>
                <div className="text-xs text-gray-500">{c.category}</div>
              </div>
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
              <div className="col-span-2 p-3 text-gray-800">{c.enrollments}</div>
              <div className="col-span-3 p-3 text-right">
                <button
                  onClick={() => togglePublish(c.id)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {c.status === 'Published' ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>
          ))
        )}

        {filtered.length > pageSize && (
          <div className="pt-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminCourses;

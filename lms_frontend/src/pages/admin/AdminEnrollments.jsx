import React, { useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import EmptyState from '../../components/ui/EmptyState';

/**
 * PUBLIC_INTERFACE
 * AdminEnrollments - Minimal list with course filter and student search.
 */
const initialEnrollments = [
  { id: 'e1', student: 'Alice Johnson', course: 'Intro to Testing', status: 'Active', progress: 64 },
  { id: 'e2', student: 'Bob Smith', course: 'DevOps Fundamentals', status: 'Completed', progress: 100 },
  { id: 'e3', student: 'Carol Jones', course: 'React for Beginners', status: 'Active', progress: 28 },
];

const AdminEnrollments = () => {
  const [q, setQ] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');

  const courses = useMemo(
    () => ['Intro to Testing', 'DevOps Fundamentals', 'React for Beginners'],
    []
  );

  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    return initialEnrollments.filter((e) => {
      const matchesCourse = courseFilter === 'all' ? true : e.course === courseFilter;
      const matchesSearch = e.student.toLowerCase().includes(term);
      return matchesCourse && matchesSearch;
    });
  }, [q, courseFilter]);

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Enrollments</h1>
        <p className="text-gray-500">Track student progress across courses.</p>
      </section>

      <Card>
        <div className="flex items-center gap-3 mb-3">
          <Input
            placeholder="Search by student"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="border rounded px-2 py-2 text-sm"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-12 bg-gray-50 border-b">
          <div className="col-span-4 p-3 text-sm text-gray-600">Student</div>
          <div className="col-span-4 p-3 text-sm text-gray-600">Course</div>
          <div className="col-span-2 p-3 text-sm text-gray-600">Status</div>
          <div className="col-span-2 p-3 text-sm text-gray-600">Progress</div>
        </div>
        {filtered.length === 0 ? (
          <EmptyState title="No enrollments match" subtitle="Adjust filter or search." />
        ) : (
          filtered.map((e) => (
            <div key={e.id} className="grid grid-cols-12 border-b last:border-0">
              <div className="col-span-4 p-3 text-gray-800">{e.student}</div>
              <div className="col-span-4 p-3 text-gray-800">{e.course}</div>
              <div className="col-span-2 p-3 text-gray-800">{e.status}</div>
              <div className="col-span-2 p-3 text-gray-800">{e.progress}%</div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};

export default AdminEnrollments;

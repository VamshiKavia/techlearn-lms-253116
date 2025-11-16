import React, { useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';
import { getMockInstructorSubmissions, getMockInstructorCourses } from '../../services/mockData';

/**
 * PUBLIC_INTERFACE
 * InstructorSubmissions - Lightweight list of recent assignment submissions with a mock grading dialog.
 * Role-protected via routes. Uses mock data only and adheres to Ocean Professional minimalist theme.
 */
const InstructorSubmissions = () => {
  const [loading, setLoading] = useState(false);
  const [gradingItem, setGradingItem] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [localStatuses, setLocalStatuses] = useState({}); // id -> 'Graded' | 'Submitted'

  const submissions = useMemo(() => {
    const items = getMockInstructorSubmissions();
    // overlay any local status changes
    return items.map((item) =>
      localStatuses[item.id] ? { ...item, status: localStatuses[item.id] } : item
    );
  }, [localStatuses]);

  const instructorCourses = useMemo(() => getMockInstructorCourses(), []);

  const openGrade = (item) => {
    setGradingItem(item);
    setGrade(item.grade || '');
    setFeedback(item.feedback || '');
  };

  const closeGrade = () => {
    setGradingItem(null);
    setGrade('');
    setFeedback('');
  };

  const submitGrade = () => {
    if (!gradingItem) return;
    // Mock: update local state only
    setLocalStatuses((prev) => ({ ...prev, [gradingItem.id]: 'Graded' }));
    closeGrade();
  };

  return (
    <div className="space-y-16">
      <section>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Submissions</h1>
        <p className="text-gray-500">Recent assignment submissions from your courses.</p>
      </section>

      <section className="space-y-4">
        <Card className="p-0 overflow-hidden">
          <div className="grid grid-cols-12 gap-0 bg-gray-50 border-b">
            <div className="col-span-4 p-3 text-sm text-gray-600">Student</div>
            <div className="col-span-3 p-3 text-sm text-gray-600">Course</div>
            <div className="col-span-2 p-3 text-sm text-gray-600">Lesson</div>
            <div className="col-span-2 p-3 text-sm text-gray-600">Status</div>
            <div className="col-span-1 p-3 text-sm text-gray-600 text-right">Action</div>
          </div>
          {loading ? (
            <div className="p-4">
              <Skeleton height="h-6" />
            </div>
          ) : submissions.length === 0 ? (
            <EmptyState title="No submissions yet" subtitle="New submissions will appear here." />
          ) : (
            submissions.map((s) => (
              <div key={s.id} className="grid grid-cols-12 gap-0 border-b last:border-0">
                <div className="col-span-4 p-3 text-gray-800">{s.studentName}</div>
                <div className="col-span-3 p-3 text-gray-800">
                  {instructorCourses.find((c) => c.id === s.courseId)?.title || s.courseTitle}
                </div>
                <div className="col-span-2 p-3 text-gray-800 truncate" title={s.lessonTitle}>
                  {s.lessonTitle}
                </div>
                <div className="col-span-2 p-3">
                  <span
                    className={
                      'inline-flex items-center px-2 py-0.5 rounded text-xs ' +
                      (s.status === 'Graded'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-700')
                    }
                  >
                    {s.status}
                  </span>
                </div>
                <div className="col-span-1 p-3 text-right">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openGrade(s)}
                    disabled={s.status === 'Graded'}
                  >
                    Grade
                  </Button>
                </div>
              </div>
            ))
          )}
        </Card>
      </section>

      {gradingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/30 flex items-end sm:items-center justify-center p-4 z-40"
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-800">Grade Submission</h2>
              <button
                onClick={closeGrade}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                {gradingItem.studentName} • {gradingItem.lessonTitle}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Grade</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="e.g., 85"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Feedback</label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Optional feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={closeGrade}>
                Cancel
              </Button>
              <Button variant="primary" onClick={submitGrade}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorSubmissions;

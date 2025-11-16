import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { mockCourses } from '../../services/mockData';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Minimal Course detail: overview header, progress with primary CTA, modules/lessons, and a minimal resources section heading.
 */
export default function CourseDetail() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setCourse(mockCourses[0]);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div className="mb-4">
        {loading ? (
          <>
            <div className="skeleton mb-2" style={{ height: 28, width: '60%' }} />
            <div className="skeleton" style={{ height: 16, width: '80%' }} />
          </>
        ) : (
          <>
            <h1 className="h1">{course.title}</h1>
            <p className="subtle">{course.level} • {course.category}</p>
          </>
        )}
      </div>

      <Card>
        {loading ? (
          <>
            <div className="skeleton mb-3" style={{ height: 12, width: '100%' }} />
            <div className="progress-track" style={{ height: 10 }} />
            <div className="skeleton mt-3" style={{ height: 36, width: 120 }} />
          </>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <ProgressBar value={course.progress || 0} />
            <Button ariaLabel="Enroll or Continue">{(course.progress || 0) > 0 ? 'Continue' : 'Enroll'}</Button>
          </div>
        )}
      </Card>

      <div className="mt-6">
        <h2 className="h2 mb-3">Modules & Lessons</h2>
        {loading ? (
          <>
            <Skeleton height={48} className="mb-2" />
            <Skeleton height={48} className="mb-2" />
            <Skeleton height={48} className="mb-2" />
          </>
        ) : (
          <div className="flex flex-col gap-3">
            {course.modules?.map(m => (
              <Card key={m.id} className="p-4">
                <div className="h3 mb-1">{m.title}</div>
                <div className="subtle text-sm">{m.lessons?.length || 0} lessons</div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h2 className="h2 mb-3">Resources</h2>
        {loading ? (
          <Skeleton height={36} />
        ) : (
          <Card className="p-4">
            <div className="subtle text-sm">Minimal resources list (mock)</div>
          </Card>
        )}
      </div>
    </div>
  );
}

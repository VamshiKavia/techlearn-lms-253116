import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { mockCourses } from '../../services/mockData';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Lesson player mock view with video/reading placeholder.
 */
export default function LessonPlayer() {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      const c = mockCourses[0];
      const l = c?.modules?.[0]?.lessons?.[0];
      setLesson(l);
      setLoading(false);
    }, 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div className="mb-4">
        {loading ? (
          <div className="skeleton" style={{ height: 26, width: '50%' }} />
        ) : (
          <h1 className="h1">{lesson?.title || 'Lesson'}</h1>
        )}
      </div>
      <Card className="p-6">
        {loading ? (
          <>
            <div className="skeleton mb-4" style={{ height: 320, width: '100%', borderRadius: 12 }} />
            <div className="skeleton mb-2" style={{ height: 14, width: '80%' }} />
            <div className="skeleton mb-4" style={{ height: 14, width: '60%' }} />
            <div className="flex gap-2">
              <div className="skeleton" style={{ height: 36, width: 90 }} />
              <div className="skeleton" style={{ height: 36, width: 90 }} />
            </div>
          </>
        ) : (
          <>
            {lesson?.type === 'video' ? (
              <div
                style={{
                  height: 320,
                  width: '100%',
                  background: 'rgba(17,24,39,0.06)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--muted)',
                }}
                aria-label="Lesson video player placeholder"
              >
                Video Placeholder
              </div>
            ) : (
              <div className="subtle">Reading content placeholder</div>
            )}
            <div className="flex gap-2 mt-4">
              <Button variant="secondary" ariaLabel="Previous lesson">Prev</Button>
              <Button ariaLabel="Next lesson">Next</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

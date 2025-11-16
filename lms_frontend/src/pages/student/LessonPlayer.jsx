import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { mockCourses } from '../../services/mockData';
import { Link } from 'react-router-dom';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Minimal Lesson player: video/text viewport, Mark as Complete, and link to Q&A.
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
    }, 300);
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
            <div className="skeleton mb-2" style={{ height: 14, width: '60%' }} />
            <div className="skeleton" style={{ height: 36, width: 160 }} />
          </>
        ) : (
          <>
            <div
              aria-label="lesson player viewport"
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
            >
              {lesson?.type === 'video' ? 'Video Placeholder' : 'Reading Placeholder'}
            </div>

            <div className="flex items-center gap-3 mt-4">
              <Button ariaLabel="Mark as complete">Mark as Complete</Button>
              <Link to="/student/qna" className="btn secondary" aria-label="Go to Q&A">Q&A</Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

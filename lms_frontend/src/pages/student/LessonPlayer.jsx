import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { mockCourses } from '../../services/mockData';
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Minimal Lesson player: video/text viewport, Mark as Complete, and link to Q&A.
 * Resolves the lesson from route params: /student/courses/:courseId/lessons/:lessonId
 */
export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  const resolvedLesson = useMemo(() => {
    const course = mockCourses.find(c => c.id === courseId) || mockCourses[0];
    const allLessons = (course.modules || []).flatMap(m => m.lessons || []);
    return allLessons.find(l => l.id === lessonId) || allLessons[0];
  }, [courseId, lessonId]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setLesson(resolvedLesson || null);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [resolvedLesson]);

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
            <div aria-label="lesson player viewport" className="mb-4">
              {lesson?.type === 'video' && lesson?.url ? (
                // Fallback to HTML5 video for mp4 placeholders (kept simple for tests)
                <video controls className="responsive-video">
                  <source src={lesson.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
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
                >
                  Reading Placeholder
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <Button ariaLabel="Mark as complete">Mark as Complete</Button>
              <Link to="/student/qna" className="btn secondary" aria-label="Go to Q&A">
                Q&A
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

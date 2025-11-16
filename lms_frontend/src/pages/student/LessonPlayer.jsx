import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';

/**
 * PUBLIC_INTERFACE
 * LessonPlayer renders a simple mock lesson view (video/reading) by ids.
 */
export default function LessonPlayer() {
  const { courseId, lessonId } = useParams();

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0 }}>Lesson</h1>
        <Link to={`/student/courses/${courseId}`} className="btn ghost">
          Back to Course
        </Link>
      </div>

      <Card>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ fontWeight: 700 }}>Now Playing</div>
          <div style={{ fontSize: 14, color: 'var(--color-secondary)' }}>
            Course: {courseId} • Lesson: {lessonId}
          </div>
          <div
            style={{
              height: 240,
              background: 'rgba(17,24,39,0.06)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-secondary)',
            }}
            aria-label="lesson player viewport"
          >
            Video/Reading Placeholder
          </div>
          <div style={{ fontSize: 14 }}>
            This is a mock lesson viewer. Integrate a real video player or rich text reader during backend hookup.
          </div>
          <div>
            <Link to={`/student/qna?courseId=${courseId}`} className="btn ghost">Ask a Question</Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

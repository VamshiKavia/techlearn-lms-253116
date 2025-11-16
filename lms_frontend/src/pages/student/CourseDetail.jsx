import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';
import Card from '../../components/ui/Card';
import RatingStars from '../../components/ui/RatingStars';
import ProgressBar from '../../components/ui/ProgressBar';

/**
 * PUBLIC_INTERFACE
 * CourseDetail shows course information, modules/lessons list, and resources using mock data.
 */
export default function CourseDetail() {
  const { services } = React.useContext(AuthContext);
  const { courseId } = useParams();
  const [course, setCourse] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    services.courses
      .get(courseId)
      .then(setCourse)
      .finally(() => setLoading(false));
  }, [services, courseId]);

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found.</div>;

  const progress = 12; // mock overall progress

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h1 style={{ margin: 0 }}>{course.title}</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
          <RatingStars value={course.rating || 0} />
          <span style={{ fontSize: 12, color: 'var(--color-secondary)' }}>{course.category}</span>
        </div>
        <p style={{ color: 'var(--color-secondary)', marginTop: 6 }}>{course.description}</p>
      </div>

      <Card>
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ fontSize: 12, color: 'var(--color-secondary)' }}>Overall Progress</div>
          <ProgressBar value={progress} />
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Link to={`/student/reviews?courseId=${course.id}`} className="btn ghost">Course Reviews</Link>
            <Link to={`/student/qna?courseId=${course.id}`} className="btn ghost">Course Q&A</Link>
          </div>
        </div>
      </Card>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '2fr 1fr' }}>
        <Card>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Modules & Lessons</div>
          <ul style={{ display: 'grid', gap: 8 }}>
            {course.modules.map((m) => (
              <li key={m.id} style={{ display: 'grid', gap: 6 }}>
                <div style={{ fontWeight: 600 }}>{m.title}</div>
                <ul style={{ display: 'grid', gap: 6 }}>
                  {m.lessons.map((l) => (
                    <li
                      key={l.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 10px',
                        border: '1px solid rgba(17,24,39,0.06)',
                        borderRadius: 8,
                        background: '#fff',
                      }}
                    >
                      <span>
                        {l.title}{' '}
                        <span style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
                          • {l.type}
                          {l.durationMin ? ` • ${l.durationMin}m` : ''}
                        </span>
                      </span>
                      <Link
                        to={
                          l.type === 'quiz'
                            ? `/student/courses/${course.id}/quizzes/${l.id}`
                            : l.type === 'assignment'
                            ? `/student/courses/${course.id}/assignments/${l.id}`
                            : `/student/courses/${course.id}/lessons/${l.id}`
                        }
                        className="btn ghost"
                      >
                        Open
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Card>

        <div style={{ display: 'grid', gap: 12 }}>
          <Card>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Resources</div>
            {course.resources.length === 0 ? (
              <div style={{ fontSize: 14, color: 'var(--color-secondary)' }}>No resources.</div>
            ) : (
              <ul style={{ display: 'grid', gap: 6 }}>
                {course.resources.map((r) => (
                  <li key={r.id}>
                    <a className="input" href={r.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: 8 }}>
                      {r.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Actions</div>
            <button className="btn" disabled>
              Enroll (mock)
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
}

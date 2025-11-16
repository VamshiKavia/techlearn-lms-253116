import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/ProgressBar';
import EmptyState from '../../components/ui/EmptyState';
import { Skeleton } from '../../components/ui/Skeleton';
const mockCourses = [
  {
    id: 'fs-react-node',
    title: 'Full-Stack React & Node.js',
    category: 'Full-Stack',
    level: 'Intermediate',
    modules: [
      { id: 'm1', lessons: [{ id: 'l1', title: 'Intro & Setup' }, { id: 'l2', title: 'Project Structure' }] },
      { id: 'm2', lessons: [{ id: 'l3', title: 'Hooks Deep Dive' }] },
    ],
  },
  {
    id: 'devops-kubernetes',
    title: 'Kubernetes for DevOps',
    category: 'DevOps',
    level: 'Intermediate',
    modules: [
      { id: 'm1', lessons: [{ id: 'k1', title: 'K8s Basics' }, { id: 'k2', title: 'Deployments' }] },
    ],
  },
  {
    id: 'ds-python-ml',
    title: 'Python for Data Science & ML',
    category: 'Data Science',
    level: 'Beginner',
    modules: [
      { id: 'm1', lessons: [{ id: 'p1', title: 'Pandas Basics' }, { id: 'p2', title: 'NumPy Intro' }] },
    ],
  },
];
import '../../styles/theme.css';

/**
 * PUBLIC_INTERFACE
 * Student My Learning page
 * - Shows enrolled courses with progress bars
 * - Next lesson CTA (Resume)
 * - Recent activity (last 5)
 * - Badges/achievements (mock)
 * - Quick links to Course Detail and Lesson Player
 * Strictly mock-driven: no backend calls.
 */
export default function StudentMyLearning() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [badges, setBadges] = useState([]);

  // Prepare a deterministic mock view of "enrolled + progress + next lesson"
  const hydratedEnrollments = useMemo(() => {
    return enrollments.map((e) => {
      const course = mockCourses.find((c) => c.id === e.courseId);
      // Flatten lessons to find "next"
      const lessons = (course?.modules || []).flatMap((m) => m.lessons || []);
      const completedCount = Math.round(((e.progress || 0) / 100) * (lessons.length || 0));
      const nextLesson = lessons[completedCount] || lessons[lessons.length - 1] || null;
      return { ...e, course, nextLesson };
    });
  }, [enrollments]);

  useEffect(() => {
    // Simulate async load
    const t = setTimeout(() => {
      // Seed a few enrolled courses with progress values and next lesson pointers
      setEnrollments([
        { courseId: 'fs-react-node', progress: 32, lastAccessed: '2h ago' },
        { courseId: 'devops-kubernetes', progress: 58, lastAccessed: '1d ago' },
        { courseId: 'ds-python-ml', progress: 10, lastAccessed: '3d ago' },
      ]);

      // Last 5 activity events
      setRecentActivity([
        { id: 'ra-1', title: 'Watched: Intro & Setup', courseId: 'fs-react-node', when: '2h ago' },
        { id: 'ra-2', title: 'Completed: React Hooks Quiz', courseId: 'fs-react-node', when: '14h ago' },
        { id: 'ra-3', title: 'Resumed: Kubernetes Basics Lesson 2', courseId: 'devops-kubernetes', when: '1d ago' },
        { id: 'ra-4', title: 'Viewed: Pandas Basics', courseId: 'ds-python-ml', when: '2d ago' },
        { id: 'ra-5', title: 'Earned: Consistent Learner Badge', courseId: null, when: '4d ago' },
      ]);

      setBadges([
        { id: 'b-1', label: 'Consistent Learner', hint: '3 days in a row', color: '#10B981' },
        { id: 'b-2', label: 'Fast Starter', hint: 'Finished first module within a day', color: '#3B82F6' },
      ]);

      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, []);

  const handleResume = (courseId, lessonId) => {
    // Navigate to lesson player if lesson available, else to course detail
    if (courseId && lessonId) {
      navigate(`/student/courses/${courseId}/lessons/${lessonId}`);
    } else if (courseId) {
      navigate(`/student/courses/${courseId}`);
    }
  };

  return (
    <div>
      <h1 className="h1 mb-4">My Learning</h1>

      {/* Loading skeleton */}
      {loading && (
        <>
          <Skeleton height={72} className="mb-2" />
          <Skeleton height={72} className="mb-2" />
          <Skeleton height={72} className="mb-6" />
        </>
      )}

      {!loading && hydratedEnrollments.length === 0 && (
        <EmptyState
          title="No enrollments yet"
          description="Browse the catalog and start your first course."
          actionLabel="Go to Catalog"
          onAction={() => (window.location.href = '/student/catalog')}
        />
      )}

      {/* Enrolled courses list */}
      {!loading && hydratedEnrollments.length > 0 && (
        <div className="space-y-8">
          <section>
            <div className="section-intro">
              <div className="section-title">Enrolled Courses</div>
              <p className="section-subtitle">Track your progress and continue where you left off.</p>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {hydratedEnrollments.map((en) => {
                const { course, progress, nextLesson, lastAccessed } = {
                  course: en.course,
                  progress: en.progress,
                  nextLesson: en.nextLesson,
                  lastAccessed: en.lastAccessed,
                };
                if (!course) return null;

                return (
                  <Card key={course.id}>
                    <div className="flex items-center justify-between gap-3">
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{course.title}</div>
                        <div className="subtle" style={{ fontSize: 13 }}>
                          {course.level} • {course.category} • Last accessed {lastAccessed}
                        </div>
                        <div className="mt-3" aria-label="progress">
                          <ProgressBar value={progress} />
                          <div className="subtle" style={{ fontSize: 12, marginTop: 6 }}>
                            {progress}% complete
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gap: 8, minWidth: 240 }}>
                        <div className="subtle" style={{ fontSize: 12 }}>Next Up</div>
                        <div style={{ fontWeight: 600 }}>
                          {nextLesson ? nextLesson.title : 'Course Overview'}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            ariaLabel="Resume course"
                            onClick={() => handleResume(course.id, nextLesson?.id)}
                          >
                            Resume
                          </Button>
                          <Link
                            to={`/student/courses/${course.id}`}
                            className="btn secondary"
                            aria-label="Go to course detail"
                          >
                            Course
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Recent activity */}
          <section>
            <div className="section-intro">
              <div className="section-title">Recent Activity</div>
              <p className="section-subtitle">Your last 5 learning actions.</p>
            </div>
            <Card>
              <ul style={{ display: 'grid', gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
                {recentActivity.map((a) => (
                  <li key={a.id} className="flex items-center justify-between">
                    <div>
                      <div style={{ fontWeight: 600 }}>{a.title}</div>
                      {a.courseId && (
                        <Link
                          to={`/student/courses/${a.courseId}`}
                          className="subtle"
                          style={{ fontSize: 12 }}
                        >
                          View course
                        </Link>
                      )}
                    </div>
                    <div className="subtle" style={{ fontSize: 12 }}>{a.when}</div>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Badges / achievements */}
          <section>
            <div className="section-intro">
              <div className="section-title">Badges & Achievements</div>
              <p className="section-subtitle">Motivation boosts based on your progress.</p>
            </div>
            {badges.length === 0 ? (
              <EmptyState
                title="No badges yet"
                description="Keep learning to unlock your first badge!"
              />
            ) : (
              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                {badges.map((b) => (
                  <Card key={b.id} className="p-4">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div style={{ fontWeight: 700 }}>{b.label}</div>
                      <span className="badge" style={{ background: 'var(--surface-alt)', color: b.color }}>
                        Badge
                      </span>
                    </div>
                    <div className="subtle" style={{ marginTop: 6, fontSize: 13 }}>{b.hint}</div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

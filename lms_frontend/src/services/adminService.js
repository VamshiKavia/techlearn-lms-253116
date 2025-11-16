//
// Admin mock service providing integrated visibility across users, courses, enrollments, and progress.
// Uses local mock arrays only. No real backend requests.
//
/* eslint-disable no-unused-vars */

// Minimal admin-side mock data to support simplified pages

// PUBLIC_INTERFACE
export const mockUsers = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Student' },
  { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', role: 'Instructor' },
  { id: 'u3', name: 'Carol Jones', email: 'carol@example.com', role: 'Student' },
  { id: 'u4', name: 'David Lee', email: 'david@example.com', role: 'Admin' },
];

// PUBLIC_INTERFACE
export const mockCourses = [
  { id: 'c1', title: 'Intro to Testing', category: 'Software Testing', published: true, rating: 4.5, updatedAt: 5 },
  { id: 'c2', title: 'React for Beginners', category: 'Full-Stack', published: false, rating: 4.3, updatedAt: 3 },
  { id: 'c3', title: 'DevOps Fundamentals', category: 'DevOps', published: true, rating: 4.6, updatedAt: 9 },
];

// PUBLIC_INTERFACE
export const mockEnrollments = [
  { userId: 'u1', courseId: 'c1', progress: 64, status: 'active', enrolled_at: '2024-10-28T12:15:00.000Z' },
  { userId: 'u2', courseId: 'c3', progress: 100, status: 'active', enrolled_at: '2024-11-04T14:10:00.000Z' },
  { userId: 'u3', courseId: 'c2', progress: 28, status: 'inactive', enrolled_at: '2024-10-20T09:30:00.000Z' },
];

/**
 * Build derived progress summary per course and overall metrics.
 */
function buildProgressSummaries(enrollments, courses) {
  const byCourse = {};
  const byUser = {};
  let totalProgress = 0;

  enrollments.forEach((en) => {
    totalProgress += en.progress || 0;
    byCourse[en.courseId] = byCourse[en.courseId] || { learners: 0, avgProgress: 0, total: 0, id: en.courseId };
    byCourse[en.courseId].learners += 1;
    byCourse[en.courseId].total += en.progress || 0;

    byUser[en.userId] = byUser[en.userId] || { courses: 0, avgProgress: 0, total: 0, id: en.userId };
    byUser[en.userId].courses += 1;
    byUser[en.userId].total += en.progress || 0;
  });

  Object.values(byCourse).forEach((c) => {
    c.avgProgress = c.learners ? Math.round((c.total / c.learners) * 10) / 10 : 0;
    const course = courses.find((co) => co.id === c.id);
    c.title = course ? course.title : `Course ${c.id}`;
    c.published = course ? !!course.published : false;
    c.rating = course?.rating ?? 0;
  });

  Object.values(byUser).forEach((u) => {
    u.avgProgress = u.courses ? Math.round((u.total / u.courses) * 10) / 10 : 0;
  });

  return {
    totalEnrollments: enrollments.length,
    avgProgressOverall: enrollments.length ? Math.round((totalProgress / enrollments.length) * 10) / 10 : 0,
    byCourse,
    byUser,
  };
}

// PUBLIC_INTERFACE
export function getAdminOverview() {
  /** Returns high-level admin metrics and quick links */
  const users = mockUsers;
  const courses = mockCourses;
  const enrollments = mockEnrollments;

  const metrics = {
    usersTotal: users.length,
    instructors: users.filter((u) => u.role === 'Instructor').length,
    students: users.filter((u) => u.role === 'Student').length,
    coursesTotal: courses.length,
    coursesPublished: courses.filter((c) => !!c.published).length,
    enrollmentsTotal: enrollments.length,
  };

  const progress = buildProgressSummaries(enrollments, courses);

  const latestCourses = [...courses]
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    .slice(0, 6);

  const topRated = [...courses]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 6);

  return {
    metrics,
    progress,
    latestCourses,
    topRated,
  };
}

// PUBLIC_INTERFACE
export function getAdminUsers({ query = '', role = 'All', page = 1, pageSize = 10 } = {}) {
  /** Returns paginated, filtered users with basic profile info */
  let data = [...mockUsers];

  if (role && role !== 'All') {
    data = data.filter((u) => u.role === role);
  }
  if (query) {
    const q = query.toLowerCase();
    data = data.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }

  const total = data.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = data.slice(start, end);

  return { items, total, page, pageSize };
}

// PUBLIC_INTERFACE
export function assignUserRole(userId, newRole) {
  /** Mock role update. Returns updated user without persisting */
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return null;
  return { ...user, role: newRole };
}

// PUBLIC_INTERFACE
export function getAdminCourses({ query = '', status = 'All', page = 1, pageSize = 10 } = {}) {
  /** Returns paginated, filtered courses with publish status */
  let data = [...mockCourses];

  if (status === 'Published') data = data.filter((c) => !!c.published);
  if (status === 'Unpublished') data = data.filter((c) => !c.published);

  if (query) {
    const q = query.toLowerCase();
    data = data.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q) ||
        (c.instructorName || '').toLowerCase().includes(q)
    );
  }

  const total = data.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = data.slice(start, end);

  return { items, total, page, pageSize };
}

// PUBLIC_INTERFACE
export function toggleCoursePublish(courseId) {
  /** Mock publish/unpublish toggle. Returns updated course without persisting */
  const course = mockCourses.find((c) => c.id === courseId);
  if (!course) return null;
  course.published = !course.published; // mutate local mock for subsequent reads
  return { ...course };
}

/**
 * PUBLIC_INTERFACE
 * Returns paginated enrollments, filterable by user/course and searchable by name/email.
 */
export function getAdminEnrollments({
  page = 1,
  pageSize = 10,
  userId,
  courseId,
  search,
} = {}) {
  /** Returns paginated enrollments optionally filtered by user or course */
  let data = [...mockEnrollments];
  if (userId) data = data.filter((e) => e.userId === userId);
  if (courseId) data = data.filter((e) => e.courseId === courseId);

  // enrich with names and emails
  const itemsEnriched = data.map((e) => {
    const user = mockUsers.find((u) => u.id === e.userId);
    const course = mockCourses.find((c) => c.id === e.courseId);
    return {
      ...e,
      userName: user ? user.name : `User ${e.userId}`,
      userEmail: user ? user.email : '',
      userRole: user?.role || 'Student',
      courseTitle: course ? course.title : `Course ${e.courseId}`,
      courseCategory: course?.category || '',
    };
  });

  // optional text search by user name/email
  const filtered = search
    ? itemsEnriched.filter((row) => {
        const q = search.toLowerCase();
        return (
          (row.userName || '').toLowerCase().includes(q) ||
          (row.userEmail || '').toLowerCase().includes(q)
        );
      })
    : itemsEnriched;

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return { items: filtered.slice(start, end), total, page, pageSize };
}

/**
 * PUBLIC_INTERFACE
 * Get enriched enrollments by course for per-course UI panels.
 */
export function getEnrollmentsForCourse(courseId) {
  const { items } = getAdminEnrollments({ courseId, page: 1, pageSize: Number.MAX_SAFE_INTEGER });
  return items;
}

// PUBLIC_INTERFACE
export function getIntegratedQuickLinks() {
  /** Provides cross-navigation suggestions from admin into instructor/student areas */
  return [
    { label: 'Go to Instructor Dashboard', to: '/instructor/overview' },
    { label: 'Create New Course', to: '/instructor/courses/create' },
    { label: 'Browse Student Catalog', to: '/student/catalog' },
    { label: 'Student My Learning', to: '/student/courses' },
  ];
}

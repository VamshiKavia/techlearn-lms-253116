//
// Selectors to compute "Continue Learning" items from mock data.
// Keeps logic separate and easily testable.
//

import { mockEnrollments, mockCourses } from './mockData';

// PUBLIC_INTERFACE
export function getStudentContinueLearningItems(studentId) {
  /** Returns list of { courseId, courseTitle, nextLesson, progress } for the student */
  const myEnrolls = mockEnrollments.filter((e) => e.studentId === studentId);
  return myEnrolls.map((en) => {
    const course = mockCourses.find((c) => c.id === en.courseId);
    const modules = (course?.modules || []).flatMap((m) =>
      (m.lessons || []).map((lesson, idx) => ({
        ...lesson,
        moduleId: m.id,
        sequence: `${m.id}-${idx}`,
      }))
    );

    // Determine next lesson: first not completed in enrollment.progressCompletedLessonIds
    const completed = new Set(en.progressCompletedLessonIds || []);
    const next = modules.find((l) => !completed.has(l.id)) || modules[modules.length - 1] || null;

    const total = modules.length || 1;
    const done = Math.min(completed.size, total);
    const progress = Math.round((done / total) * 100);

    return {
      courseId: en.courseId,
      courseTitle: course?.title || 'Course',
      nextLesson: next,
      progress,
    };
  });
}

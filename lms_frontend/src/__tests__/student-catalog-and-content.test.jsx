import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import StudentCatalog from '../pages/student/StudentCatalog';
import CourseDetail from '../pages/student/CourseDetail';
import LessonPlayer from '../pages/student/LessonPlayer';
import QuizAttempt from '../pages/student/QuizAttempt';
import AssignmentSubmission from '../pages/student/AssignmentSubmission';

function renderWithAuth(route, authValue) {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/student/catalog', element: <StudentCatalog /> },
              { path: '/student/courses/:courseId', element: <CourseDetail /> },
              { path: '/student/courses/:courseId/lessons/:lessonId', element: <LessonPlayer /> },
              { path: '/student/courses/:courseId/quizzes/:quizId', element: <QuizAttempt /> },
              { path: '/student/courses/:courseId/assignments/:assignmentId', element: <AssignmentSubmission /> },
            ],
          },
        ],
      },
      { path: '/login', element: <div>Login Page</div> },
      { path: '/', element: <div>Home</div> },
    ],
    { initialEntries: [route] }
  );
  return render(
    <AuthContext.Provider value={authValue}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

const authStudent = {
  user: { email: 'student@example.com', role: 'student' },
  role: 'student',
  logout: () => {},
  services: {
    courses: require('../services/coursesService').createCoursesService({}),
  },
};

test('catalog renders for authenticated student with filter chips', async () => {
  renderWithAuth('/student/catalog', authStudent);
  expect(await screen.findByText(/Catalog/i)).toBeInTheDocument();
  // Categories present
  expect(screen.getByRole('button', { name: /Full-Stack Development/i })).toBeInTheDocument();
  // Cards load
  expect(await screen.findByText(/Full-Stack Development Bootcamp/i)).toBeInTheDocument();
});

test('course detail renders modules and resources', async () => {
  renderWithAuth('/student/courses/c-fs-1', authStudent);
  expect(await screen.findByText(/Full-Stack Development Bootcamp/i)).toBeInTheDocument();
  expect(screen.getByText(/Modules & Lessons/i)).toBeInTheDocument();
  expect(screen.getByText(/Resources/i)).toBeInTheDocument();
});

test('lesson player shows placeholder viewport', async () => {
  renderWithAuth('/student/courses/c-fs-1/lessons/l1', authStudent);
  expect(await screen.findByText(/Lesson/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/lesson player viewport/i)).toBeInTheDocument();
});

test('quiz attempt page loads and can render Submit button', async () => {
  renderWithAuth('/student/courses/c-fs-1/quizzes/q1', authStudent);
  expect(await screen.findByText(/Quiz/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
});

test('assignment submission page shows instructions', async () => {
  renderWithAuth('/student/courses/c-fs-1/assignments/a1', authStudent);
  expect(await screen.findByText(/Assignment:/i)).toBeInTheDocument();
  expect(screen.getByText(/Instructions/i)).toBeInTheDocument();
});

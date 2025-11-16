import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import StudentCatalog from '../pages/student/StudentCatalog';
import CourseDetail from '../pages/student/CourseDetail';
import LessonPlayer from '../pages/student/LessonPlayer';
import QuizAttempt from '../pages/student/QuizAttempt';
import AssignmentSubmission from '../pages/student/AssignmentSubmission';

jest.useFakeTimers();

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
};

test('catalog renders for authenticated student with category chips', async () => {
  renderWithAuth('/student/catalog', authStudent);
  await act(async () => { jest.advanceTimersByTime(350); });
  expect(await screen.findByText(/Catalog/i)).toBeInTheDocument();
  // Category chips present
  expect(screen.getByRole('button', { name: /Filter by Full-Stack/i })).toBeInTheDocument();
});

test('course detail renders modules and resources heading', async () => {
  renderWithAuth('/student/courses/c-fs-1', authStudent);
  await act(async () => { jest.advanceTimersByTime(350); });
  expect(screen.getByText(/Modules & Lessons/i)).toBeInTheDocument();
  expect(screen.getByText(/Resources/i)).toBeInTheDocument();
});

test('lesson player shows viewport', async () => {
  renderWithAuth('/student/courses/c-fs-1/lessons/l1', authStudent);
  await act(async () => { jest.advanceTimersByTime(350); });
  expect(screen.getByLabelText(/lesson player viewport/i)).toBeInTheDocument();
});

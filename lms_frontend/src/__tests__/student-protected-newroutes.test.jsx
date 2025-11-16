import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';

function renderWithAuth(route, authValue) {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/student/catalog', element: <div>Catalog Page</div> },
              { path: '/student/courses/:courseId', element: <div>Course Detail</div> },
              { path: '/student/courses/:courseId/lessons/:lessonId', element: <div>Lesson Player</div> },
              { path: '/student/courses/:courseId/quizzes/:quizId', element: <div>Quiz Attempt</div> },
              { path: '/student/courses/:courseId/assignments/:assignmentId', element: <div>Assignment Submit</div> },
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

test('unauthenticated redirected to login for catalog', async () => {
  renderWithAuth('/student/catalog', { user: null, role: null, logout: () => {} });
  expect(await screen.findByText(/Login Page/i)).toBeInTheDocument();
});

test('non-student role redirected home for course detail', async () => {
  renderWithAuth('/student/courses/abc', {
    user: { email: 'admin@example.com', role: 'admin' },
    role: 'admin',
    logout: () => {},
  });
  expect(await screen.findByText(/Home/i)).toBeInTheDocument();
});

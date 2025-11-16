import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import StudentSoftwareTesting from '../pages/student/StudentSoftwareTesting';
import StudentAI from '../pages/student/StudentAI';

function renderWithAuth(route) {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/student/paths/testing', element: <StudentSoftwareTesting /> },
              { path: '/student/paths/ai', element: <StudentAI /> },
            ],
          },
        ],
      },
      { path: '/login', element: <div>Login Page</div> },
    ],
    { initialEntries: [route] }
  );

  const authStudent = {
    user: { email: 'student@example.com', role: 'student' },
    role: 'student',
    logout: () => {},
  };

  return render(
    <AuthContext.Provider value={authStudent}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

describe('Student sidebar & pages: Software Testing and AI', () => {
  test('sidebar has Software Testing and AI links', async () => {
    renderWithAuth('/student/paths/testing');
    expect(await screen.findByTestId('nav-testing')).toBeInTheDocument();
    expect(screen.getByTestId('nav-ai')).toBeInTheDocument();
  });

  test('render Software Testing page with lesson links', async () => {
    renderWithAuth('/student/paths/testing');
    expect(await screen.findByText(/Software Testing Paths/i)).toBeInTheDocument();
    expect(screen.getByTestId('testing-lesson-mt-vid-1')).toBeInTheDocument();
  });

  test('render AI page with lesson links', async () => {
    renderWithAuth('/student/paths/ai');
    expect(await screen.findByText(/AI Learning Paths/i)).toBeInTheDocument();
    expect(screen.getByTestId('ai-lesson-ai-vid-1')).toBeInTheDocument();
  });
});

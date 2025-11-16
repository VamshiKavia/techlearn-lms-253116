import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import StudentCloud from '../pages/student/StudentCloud';
import StudentDevOps from '../pages/student/StudentDevOps';

function renderWithAuth(route, authValue) {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/student/paths/cloud', element: <StudentCloud /> },
              { path: '/student/paths/devops', element: <StudentDevOps /> },
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

test('student sidebar shows Cloud and DevOps links', async () => {
  renderWithAuth('/student/paths/cloud', authStudent);
  expect(await screen.findByText(/Cloud/i)).toBeInTheDocument();
  expect(screen.getByText(/DevOps/i)).toBeInTheDocument();
});

test('cloud page renders and shows Play lesson links', async () => {
  renderWithAuth('/student/paths/cloud', authStudent);
  expect(await screen.findByText(/Cloud Path/i)).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /Play/i }).length).toBeGreaterThan(0);
});

test('devops page renders and shows Play lesson links', async () => {
  renderWithAuth('/student/paths/devops', authStudent);
  expect(await screen.findByText(/DevOps Path/i)).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /Play/i }).length).toBeGreaterThan(0);
});

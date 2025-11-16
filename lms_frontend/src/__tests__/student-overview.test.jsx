import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import StudentOverview from '../pages/student/StudentOverview';

function renderWithAuth(route, authValue) {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/student', element: <StudentOverview /> },
              { path: '/student/overview', element: <StudentOverview /> },
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

test('redirects unauthenticated to login when accessing student overview', async () => {
  renderWithAuth('/student/overview', { user: null, role: null, logout: () => {} });
  expect(await screen.findByText(/Login Page/i)).toBeInTheDocument();
});

test('blocks non-student roles from accessing student overview', async () => {
  const authValue = {
    user: { email: 'admin@example.com', role: 'admin' },
    role: 'admin',
    logout: () => {},
  };
  renderWithAuth('/student/overview', authValue);
  // With ProtectedRoute redirecting unauthorized to '/', expect Home placeholder
  expect(await screen.findByText(/Home/i)).toBeInTheDocument();
});

test('renders Student Overview metrics and charts when student is authenticated', async () => {
  const authValue = {
    user: { email: 'student@example.com', role: 'student' },
    role: 'student',
    logout: () => {},
  };
  renderWithAuth('/student/overview', authValue);

  expect(await screen.findByText(/Student Overview/i)).toBeInTheDocument();
  expect(screen.getByLabelText('student-metrics')).toBeInTheDocument();

  // KPI labels
  expect(screen.getByText(/Enrolled Courses/i)).toBeInTheDocument();
  expect(screen.getByText(/Active Courses/i)).toBeInTheDocument();

  // Charts present
  expect(screen.getByRole('img', { name: /Progress Trend line chart/i })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Course Distribution bar chart/i })).toBeInTheDocument();
});

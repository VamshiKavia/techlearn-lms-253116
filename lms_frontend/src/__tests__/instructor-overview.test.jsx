import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import InstructorOverview from '../pages/instructor/InstructorOverview';

function renderWithAuth(route, authValue) {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute allowedRoles={['instructor']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/instructor', element: <InstructorOverview /> },
              { path: '/instructor/overview', element: <InstructorOverview /> },
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

test('redirects unauthenticated to login when accessing instructor overview', async () => {
  renderWithAuth('/instructor/overview', { user: null, role: null, logout: () => {} });
  expect(await screen.findByText(/Login Page/i)).toBeInTheDocument();
});

test('blocks non-instructor roles from accessing instructor overview', async () => {
  const authValue = {
    user: { email: 'student@example.com', role: 'student' },
    role: 'student',
    logout: () => {},
  };
  renderWithAuth('/instructor/overview', authValue);
  // ProtectedRoute should redirect unauthorized to '/', expect Home placeholder
  expect(await screen.findByText(/Home/i)).toBeInTheDocument();
});

test('renders Instructor Overview metrics and charts when instructor is authenticated', async () => {
  const authValue = {
    user: { email: 'instructor@example.com', role: 'instructor' },
    role: 'instructor',
    logout: () => {},
  };
  renderWithAuth('/instructor/overview', authValue);

  expect(await screen.findByText(/Instructor Overview/i)).toBeInTheDocument();
  expect(screen.getByLabelText('instructor-metrics')).toBeInTheDocument();

  // KPI labels
  expect(screen.getByText(/Active Courses/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Enrollments/i)).toBeInTheDocument();

  // Charts present
  expect(screen.getByRole('img', { name: /Monthly Enrollments line chart/i })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Completion Rate line chart/i })).toBeInTheDocument();
});

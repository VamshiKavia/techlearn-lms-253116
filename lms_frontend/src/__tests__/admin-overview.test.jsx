import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import AdminOverview from '../pages/admin/AdminOverview';

function renderWithAuth(route, authValue) {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/admin', element: <AdminOverview /> },
              { path: '/admin/overview', element: <AdminOverview /> },
            ],
          },
        ],
      },
      { path: '/login', element: <div>Login Page</div> },
    ],
    { initialEntries: [route] }
  );
  return render(
    <AuthContext.Provider value={authValue}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

test('redirects unauthenticated to login when accessing admin overview', async () => {
  renderWithAuth('/admin/overview', { user: null, role: null });
  expect(await screen.findByText(/Login Page/i)).toBeInTheDocument();
});

test('renders Admin Overview metrics when admin is authenticated', async () => {
  const authValue = {
    user: { email: 'admin@example.com', role: 'admin' },
    role: 'admin',
    logout: () => {},
  };
  renderWithAuth('/admin/overview', authValue);

  expect(await screen.findByText(/Admin Overview/i)).toBeInTheDocument();
  expect(screen.getByLabelText('metrics')).toBeInTheDocument();
  // Check a couple of KPI labels
  expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
  expect(screen.getByText(/Courses/i)).toBeInTheDocument();
  // Charts present by aria-label
  expect(screen.getByRole('img', { name: /Monthly Enrollments line chart/i })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: /Completion Rate line chart/i })).toBeInTheDocument();
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../providers/AuthProvider';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';

function renderWithProviders(route) {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          { element: <DashboardLayout />, children: [{ path: '/admin', element: <div>Admin</div> }] },
        ],
      },
      { path: '/login', element: <div>Login Page</div> },
    ],
    { initialEntries: [route] }
  );
  return render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

test('redirects unauthenticated user to login', async () => {
  renderWithProviders('/admin');
  expect(await screen.findByText(/Login Page/i)).toBeInTheDocument();
});

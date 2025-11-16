import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import StudentMyLearning from '../pages/student/StudentMyLearning';

// Arrange helper
function renderWithAuth(route, authValue) {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [{ path: '/student/learning', element: <StudentMyLearning /> }],
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

test('redirects unauthenticated to login when accessing student my learning', async () => {
  renderWithAuth('/student/learning', { user: null, role: null, logout: () => {} });
  expect(await screen.findByText(/Login Page/i)).toBeInTheDocument();
});

test('renders My Learning with both tracks for authenticated student', async () => {
  const authValue = {
    user: { email: 'student@example.com', role: 'student' },
    role: 'student',
    logout: () => {},
  };
  renderWithAuth('/student/learning', authValue);

  // Heading
  expect(await screen.findByText(/My Learning/i)).toBeInTheDocument();

  // Track titles present
  expect(screen.getByText(/Full-Stack Development/i)).toBeInTheDocument();
  expect(screen.getByText(/Data Science/i)).toBeInTheDocument();

  // Next lesson labels exist
  expect(screen.getByText(/Next Up/i)).toBeInTheDocument();

  // Progress bars should be present by aria-label
  const progressBars = screen.getAllByLabelText('progress');
  expect(progressBars.length).toBeGreaterThan(1);
});

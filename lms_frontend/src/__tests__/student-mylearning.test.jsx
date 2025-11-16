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

test('renders enrolled courses with progress bars and resume buttons for authenticated student', async () => {
  const authValue = {
    user: { email: 'student@example.com', role: 'student' },
    role: 'student',
    logout: () => {},
    services: { courses: { list: async () => ({ items: [] }) } }, // not used in this page, but context-safe
  };
  renderWithAuth('/student/learning', authValue);

  // Page heading
  expect(await screen.findByText(/My Learning/i)).toBeInTheDocument();

  // Progress bars present
  const progressBars = await screen.findAllByLabelText('progress');
  expect(progressBars.length).toBeGreaterThan(0);

  // Resume buttons present
  const resumeButtons = await screen.findAllByRole('button', { name: /resume/i });
  expect(resumeButtons.length).toBeGreaterThan(0);

  // Recent activity section
  expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();

  // Badges section
  expect(screen.getByText(/Badges & Achievements/i)).toBeInTheDocument();
});

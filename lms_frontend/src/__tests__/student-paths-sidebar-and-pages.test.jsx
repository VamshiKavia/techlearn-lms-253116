import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import StudentFullStack from '../pages/student/StudentFullStack';
import StudentDataScience from '../pages/student/StudentDataScience';

function renderWithAuth(route, authValue) {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/student/paths/full-stack', element: <StudentFullStack /> },
              { path: '/student/paths/data-science', element: <StudentDataScience /> },
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

test('student sidebar shows Full-Stack and Data Science links', async () => {
  renderWithAuth('/student/paths/full-stack', authStudent);
  // Sidebar links present
  expect(await screen.findByText(/Full-Stack/i)).toBeInTheDocument();
  expect(screen.getByText(/Data Science/i)).toBeInTheDocument();
});

test('full-stack page renders sections and lesson play links', async () => {
  renderWithAuth('/student/paths/full-stack', authStudent);
  expect(await screen.findByText(/Full-Stack Path/i)).toBeInTheDocument();
  expect(screen.getByText(/Frontend/i)).toBeInTheDocument();
  expect(screen.getByText(/Backend/i)).toBeInTheDocument();
  expect(screen.getByText(/Database/i)).toBeInTheDocument();
  // A sample lesson link button
  expect(screen.getAllByRole('link', { name: /Play/i }).length).toBeGreaterThan(0);
});

test('data science page renders and shows lesson links', async () => {
  renderWithAuth('/student/paths/data-science', authStudent);
  expect(await screen.findByText(/Data Science Path/i)).toBeInTheDocument();
  // Presence of track cards and Play links
  expect(screen.getAllByRole('link', { name: /Play/i }).length).toBeGreaterThan(0);
});

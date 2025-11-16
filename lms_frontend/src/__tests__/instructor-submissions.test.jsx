import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import ProtectedRoute from '../routes/ProtectedRoute';
import InstructorSubmissions from '../pages/instructor/InstructorSubmissions';
import { AuthContext } from '../providers/AuthProvider';

test('renders instructor submissions list for instructor role', async () => {
  const value = { user: { id: '1', role: 'instructor' }, loading: false, login: jest.fn(), logout: jest.fn() };
  render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={['/instructor/submissions']}>
        <Routes>
          <Route
            element={
              <ProtectedRoute roles={['student', 'instructor', 'admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route element={<ProtectedRoute roles={['instructor']} />}>
              <Route path="/instructor/submissions" element={<InstructorSubmissions />} />
            </Route>
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

  expect(await screen.findByText(/Submissions/i)).toBeInTheDocument();
});

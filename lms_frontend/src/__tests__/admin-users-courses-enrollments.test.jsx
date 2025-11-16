import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider } from '../providers/AuthProvider.jsx';
import AppRoutes from '../routes/AppRoutes.jsx';

function renderWithAuth(ui, user) {
  return render(
    <AuthProvider initialUser={user}>
      <MemoryRouter initialEntries={['/admin/overview']}>
        {ui}
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('Admin area routes', () => {
  it('renders Admin Overview for Admin user', () => {
    renderWithAuth(<AppRoutes />, { role: 'Admin', name: 'A' });
    expect(screen.getByText(/Admin Overview/i)).toBeInTheDocument();
  });

  it('blocks Student from Admin Overview', () => {
    renderWithAuth(<AppRoutes />, { role: 'Student', name: 'S' });
    // should redirect to student overview or protected
    // student overview text exists in the app test suite; check one of generic labels
    // We don't assert exact redirect target; only that Admin Overview not visible
    expect(screen.queryByText(/Admin Overview/i)).not.toBeInTheDocument();
  });

  it('renders Admin Users page', () => {
    render(
      <AuthProvider initialUser={{ role: 'Admin', name: 'A' }}>
        <MemoryRouter initialEntries={['/admin/users']}>
          <AppRoutes />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/Users/i)).toBeInTheDocument();
  });

  it('renders Admin Courses page', () => {
    render(
      <AuthProvider initialUser={{ role: 'Admin', name: 'A' }}>
        <MemoryRouter initialEntries={['/admin/courses']}>
          <AppRoutes />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/Courses/i)).toBeInTheDocument();
  });

  it('renders Admin Enrollments page', () => {
    render(
      <AuthProvider initialUser={{ role: 'Admin', name: 'A' }}>
        <MemoryRouter initialEntries={['/admin/enrollments']}>
          <AppRoutes />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText(/Enrollments & Progress/i)).toBeInTheDocument();
  });
});

import React from 'react';
import { AuthProvider } from '../providers/AuthProvider.jsx';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppRoutes from '../routes/AppRoutes.jsx';

describe('ProtectedRoute for Admin', () => {
  it('allows Admin role', () => {
    render(
      <AuthProvider initialUser={{ role: 'Admin', name: 'Admin' }}>
        <MemoryRouter initialEntries={['/admin/overview']}>
          <AppRoutes />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.getByText('Admin Overview')).toBeInTheDocument();
  });

  it('denies Student role', () => {
    render(
      <AuthProvider initialUser={{ role: 'Student', name: 'Bob' }}>
        <MemoryRouter initialEntries={['/admin/overview']}>
          <AppRoutes />
        </MemoryRouter>
      </AuthProvider>
    );
    expect(screen.queryByText('Admin Overview')).not.toBeInTheDocument();
  });
});

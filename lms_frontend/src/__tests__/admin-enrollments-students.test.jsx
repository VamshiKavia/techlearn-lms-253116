import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider } from '../providers/AuthProvider.jsx';
import AppRoutes from '../routes/AppRoutes.jsx';

function renderAsAdmin(initialEntries = ['/admin/enrollments']) {
  return render(
    <AuthProvider initialUser={{ role: 'Admin', name: 'Admin' }}>
      <MemoryRouter initialEntries={initialEntries}>
        <AppRoutes />
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('Admin Enrollments listing', () => {
  it('renders enrolled students list and allows searching by name/email', () => {
    renderAsAdmin(['/admin/enrollments']);
    expect(screen.getByText(/Enrollments & Progress/i)).toBeInTheDocument();

    // There should be at least one known mock student
    expect(screen.getByText(/Sam Student/i)).toBeInTheDocument();

    // Search by email
    const search = screen.getByPlaceholderText(/Search by name or email/i);
    fireEvent.change(search, { target: { value: 'sasha.student@example.com' } });

    // Only Sasha should be visible
    expect(screen.getByText(/Sasha Student/)).toBeInTheDocument();
    expect(screen.queryByText(/Sam Student/)).not.toBeInTheDocument();
  });

  it('filters by course via dropdown', () => {
    renderAsAdmin(['/admin/enrollments']);

    const select = screen.getByLabelText(/Course/i);
    // choose Kubernetes course
    fireEvent.change(select, { target: { value: 'devops-kubernetes' } });

    // Now course titles shown should include Kubernetes
    expect(screen.getAllByText(/Kubernetes for DevOps/).length).toBeGreaterThan(0);
  });
});

describe('Admin Courses per-course enrolled students panel', () => {
  it('shows students for a course when expanded and supports search', () => {
    renderAsAdmin(['/admin/courses']);
    // open first "View Students" button
    const toggleBtns = screen.getAllByRole('button', { name: /Toggle enrolled students/i });
    fireEvent.click(toggleBtns[0]);

    // Progress entries present
    expect(screen.getByText(/Open as student/i)).toBeInTheDocument();

    const searchInputs = screen.getAllByPlaceholderText(/Search by name or email/);
    fireEvent.change(searchInputs[0], { target: { value: 'Sam Student' } });
    expect(screen.getByText(/Sam Student/)).toBeInTheDocument();
  });
}

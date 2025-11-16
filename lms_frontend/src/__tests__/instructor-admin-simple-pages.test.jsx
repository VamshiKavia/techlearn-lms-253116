import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';
import { AuthProvider } from '../providers-mock';

function renderWithRole(role) {
  return render(
    <AuthProvider role={role}>
      <App />
    </AuthProvider>
  );
}

describe('Instructor simple pages', () => {
  test('shows instructor overview KPIs and menu', async () => {
    renderWithRole('instructor');
    // Navigate into protected layout defaults via dashboard routes test harness
    // Expect Instructor menu items
    expect(await screen.findByText(/Instructor/i)).toBeInTheDocument();
    expect(screen.getByText(/Overview/)).toBeInTheDocument();
    expect(screen.getByText(/My Courses/)).toBeInTheDocument();
    expect(screen.getByText(/Submissions/)).toBeInTheDocument();
  });
});

describe('Admin simple pages', () => {
  test('shows admin menu with simplified entries', async () => {
    renderWithRole('admin');
    expect(await screen.findByText(/Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/Overview/)).toBeInTheDocument();
    expect(screen.getByText(/Users/)).toBeInTheDocument();
    expect(screen.getByText(/Courses/)).toBeInTheDocument();
    expect(screen.getByText(/Enrollments/)).toBeInTheDocument();
  });
});

describe('ProtectedRoute blocks unauthorized', () => {
  test('student cannot see admin menu', async () => {
    renderWithRole('student');
    expect(await screen.findByText(/Student/i)).toBeInTheDocument();
    expect(screen.queryByText(/Admin/i)).not.toBeInTheDocument();
  });
});

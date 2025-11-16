import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';

/**
 * Ensures non-admin users are blocked from admin routes.
 */
test('non-admin cannot access admin route', async () => {
  const value = { user: { id: '1', role: 'student' }, loading: false, login: jest.fn(), logout: jest.fn() };
  render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={['/admin/overview']}>
        <App />
      </MemoryRouter>
    </AuthContext.Provider>
  );
  // The app may redirect or show not-found; assert we didn't render the Admin nav
  expect(screen.queryByText(/Admin/i)).not.toBeInTheDocument();
});

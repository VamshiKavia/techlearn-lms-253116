import { render, screen } from '@testing-library/react';
import App from './App';

test('renders student overview heading (with preloaded auth)', () => {
  // Preload a mock user in localStorage so protected route permits rendering
  window.localStorage.setItem('tl_auth_user', JSON.stringify({ id: 'u1', email: 'test@example.com', name: 'Test User', role: 'student' }));
  render(<App />);
  const heading = screen.getByText(/Student Overview/i);
  expect(heading).toBeInTheDocument();
  window.localStorage.removeItem('tl_auth_user');
});

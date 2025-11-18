import { render, screen } from '@testing-library/react';
import App from './App';

test('shows login page when not authenticated', () => {
  render(<App />);
  const loginTitle = screen.getByText(/Welcome back/i);
  expect(loginTitle).toBeInTheDocument();
});

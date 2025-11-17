import { render, screen } from '@testing-library/react';
import App from './App';

test('renders student overview heading', () => {
  render(<App />);
  const heading = screen.getByText(/Student Overview/i);
  expect(heading).toBeInTheDocument();
});

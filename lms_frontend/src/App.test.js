import { render, screen } from '@testing-library/react';
import App from './App';

test('renders application root', async () => {
  render(<App />);
  expect(await screen.findByText(/Explore Courses/i)).toBeInTheDocument();
});

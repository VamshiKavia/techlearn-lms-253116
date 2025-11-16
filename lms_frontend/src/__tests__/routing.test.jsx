import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Home page heading', async () => {
  render(<App />);
  expect(await screen.findByText(/Explore Courses/i)).toBeInTheDocument();
});

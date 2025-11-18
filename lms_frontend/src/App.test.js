import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { CatalogPage } from './pages/common/CatalogPage';

test('shows login page when not authenticated', () => {
  render(<App />);
  const loginTitle = screen.getByText(/Welcome back/i);
  expect(loginTitle).toBeInTheDocument();
});

test('catalog course cards (rendered in isolation) are visible', async () => {
  // Render CatalogPage directly to avoid auth/routing state
  render(<CatalogPage />);

  const viewButtons = await screen.findAllByRole('button', { name: /view/i });
  expect(viewButtons.length).toBeGreaterThan(0);

  const card = viewButtons[0].closest('.card');
  expect(card).not.toBeNull();

  const style = window.getComputedStyle(card);
  expect(parseFloat(style.opacity)).toBeGreaterThan(0);

  const borderWidth = parseFloat(style.borderTopWidth || '0');
  expect(borderWidth).toBeGreaterThanOrEqual(1);
});

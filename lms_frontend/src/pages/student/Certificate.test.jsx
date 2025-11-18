import React from 'react';
import { render, screen } from '@testing-library/react';
import { Certificates } from './Certificate';

// PUBLIC_INTERFACE
describe('Certificates page card visibility', () => {
  it('renders certificate cards that are visible and interactive (opacity > 0)', async () => {
    render(<Certificates />);

    // Locate any "Preview" buttons that appear on issued certificates
    const previewButtons = await screen.findAllByRole('button', { name: /preview/i });
    expect(previewButtons.length).toBeGreaterThan(0);

    const card = previewButtons[0].closest('.card');
    expect(card).not.toBeNull();

    const style = window.getComputedStyle(card);
    expect(parseFloat(style.opacity)).toBeGreaterThan(0);

    const borderWidth = parseFloat(style.borderTopWidth || '0');
    expect(borderWidth).toBeGreaterThanOrEqual(1);
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { CourseCard } from './CourseCard';

describe('CourseCard visibility', () => {
  // PUBLIC_INTERFACE
  it('renders a visible card with non-zero opacity and has a border/background applied', () => {
    const onView = jest.fn();
    render(
      <div data-testid="host">
        <CourseCard
          title="Test Course"
          rating={4.5}
          students={1234}
          duration="8h 30m"
          onView={onView}
        />
      </div>
    );

    const viewBtn = screen.getByRole('button', { name: /view/i });
    expect(viewBtn).toBeInTheDocument();

    const card = viewBtn.closest('.card');
    expect(card).not.toBeNull();

    const style = window.getComputedStyle(card);
    // Visibility assertions
    expect(parseFloat(style.opacity)).toBeGreaterThan(0);

    // Border should be present (width >= 1)
    const borderWidth = parseFloat(style.borderTopWidth || '0');
    expect(borderWidth).toBeGreaterThanOrEqual(1);

    // Background should resolve to a color value (not fully transparent)
    // Note: some browsers may report 'rgba(...)'. We assert alpha not 0 when provided.
    const bg = style.backgroundColor || '';
    if (bg.startsWith('rgba')) {
      const alpha = parseFloat(bg.split(',').pop()?.replace(')', '') || '1');
      expect(alpha).toBeGreaterThan(0);
    }
  });
});

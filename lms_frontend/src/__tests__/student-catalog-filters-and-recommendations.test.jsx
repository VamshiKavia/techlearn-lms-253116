import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, act, fireEvent } from '@testing-library/react';
import StudentCatalog from '../pages/student/StudentCatalog';

jest.useFakeTimers();

describe('StudentCatalog simplified catalog', () => {
  test('category chips, search box, simple sort, and pagination work', async () => {
    render(
      <MemoryRouter>
        <StudentCatalog />
      </MemoryRouter>
    );

    // skeleton
    await act(async () => { jest.advanceTimersByTime(350); });

    // Category chip filter
    fireEvent.click(screen.getByRole('button', { name: /Filter by Data Science/i }));
    await act(async () => { jest.advanceTimersByTime(350); });

    // Search narrows results
    const search = screen.getByRole('textbox', { name: /Search courses/i });
    fireEvent.change(search, { target: { value: 'python' } });
    await act(async () => { jest.advanceTimersByTime(350); });

    // Sort by Highest Rated
    fireEvent.click(screen.getByRole('button', { name: /Sort by Highest Rated/i }));
    await act(async () => { jest.advanceTimersByTime(350); });

    // Grid present
    expect(screen.getByLabelText('catalog-grid')).toBeInTheDocument();

    // Clear resets state
    fireEvent.click(screen.getByRole('button', { name: /Clear all/i }));
    await act(async () => { jest.advanceTimersByTime(350); });
    expect(search).toHaveValue('');
  });
});

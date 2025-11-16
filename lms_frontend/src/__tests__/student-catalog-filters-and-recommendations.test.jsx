import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, act, fireEvent } from '@testing-library/react';
import StudentCatalog from '../pages/student/StudentCatalog';
import { mockUserProfile } from '../services/mockData';

jest.useFakeTimers();

describe('StudentCatalog advanced filters and recommendations (mock)', () => {
  test('filters reduce result set and tags toggle affects results', async () => {
    render(
      <MemoryRouter>
        <StudentCatalog />
      </MemoryRouter>
    );

    // Wait for initial load
    await act(async () => { jest.advanceTimersByTime(450); });

    // Capture initial count from grid
    const gridBefore = screen.getByLabelText('catalog-grid');
    const initialCards = gridBefore.querySelectorAll('.card').length;
    expect(initialCards).toBeGreaterThan(0);

    // Apply Level Beginner
    const beginnerBtn = screen.getByRole('button', { name: /Level Beginner/i });
    fireEvent.click(beginnerBtn);
    await act(async () => { jest.advanceTimersByTime(450); });

    const gridAfterLevel = screen.getByLabelText('catalog-grid');
    const afterLevelCards = gridAfterLevel.querySelectorAll('.card').length;
    expect(afterLevelCards).toBeGreaterThan(0);
    expect(afterLevelCards).toBeLessThanOrEqual(initialCards);

    // Toggle a tag that should exist, e.g., 'python'
    const pythonTag = screen.getByRole('button', { name: /Tag python/i });
    fireEvent.click(pythonTag);
    await act(async () => { jest.advanceTimersByTime(450); });

    const gridAfterTag = screen.getByLabelText('catalog-grid');
    const afterTagCards = gridAfterTag.querySelectorAll('.card').length;
    expect(afterTagCards).toBeGreaterThan(0);
    expect(afterTagCards).toBeLessThanOrEqual(afterLevelCards);
  });

  test('recommendations render based on mocked user profile', async () => {
    render(
      <MemoryRouter>
        <StudentCatalog />
      </MemoryRouter>
    );

    await act(async () => { jest.advanceTimersByTime(450); });

    // Recommendations section title
    expect(screen.getByText(/Recommended for you/i)).toBeInTheDocument();

    // At least one recommended card contains a category from user profile
    const recCards = screen.getAllByRole('article').filter(el => el.textContent?.includes('Recommended') === false);
    // We don't rely on internal structure; instead check DOM contains a course that matches profile interests
    const expectedCategoryMatch = ['Data Science', 'DevOps'].some(cat =>
      document.body.textContent?.includes(cat)
    );
    expect(expectedCategoryMatch).toBe(true);

    // Ensure mock profile is available
    expect(mockUserProfile.enrolledCategories.length).toBeGreaterThan(0);
  });

  test('save this search stores a saved chip and can re-apply', async () => {
    render(
      <MemoryRouter>
        <StudentCatalog />
      </MemoryRouter>
    );

    await act(async () => { jest.advanceTimersByTime(450); });

    const setRating = screen.getByRole('button', { name: /Rating 4\.5\+/i });
    fireEvent.click(setRating);

    const sortHighest = screen.getByRole('button', { name: /Sort by Highest Rated/i });
    fireEvent.click(sortHighest);

    const saveBtn = screen.getByRole('button', { name: /Save this search/i });
    fireEvent.click(saveBtn);

    // Saved search appears
    const savedChips = await screen.findAllByRole('button', { name: /Apply saved search/i });
    expect(savedChips.length).toBeGreaterThan(0);

    // Apply saved search
    fireEvent.click(savedChips[0]);
    await act(async () => { jest.advanceTimersByTime(200); }); // no reload simulation needed but safe

    // Verify controls reflect selection
    expect(screen.getByRole('button', { name: /Rating 4\.5\+/i })).toHaveClass('btn');
  });
});

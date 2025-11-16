import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, act, fireEvent } from '@testing-library/react';
import StudentCatalog from '../pages/student/StudentCatalog';
import CourseDetail from '../pages/student/CourseDetail';
import LessonPlayer from '../pages/student/LessonPlayer';

jest.useFakeTimers();

test('StudentCatalog shows skeleton then courses and pagination', async () => {
  render(
    <MemoryRouter>
      <StudentCatalog />
    </MemoryRouter>
  );
  await act(async () => { jest.advanceTimersByTime(350); });
  expect(screen.getByText(/Catalog/)).toBeInTheDocument();
  // Pagination nav present
  expect(screen.getByRole('navigation')).toBeInTheDocument();

  // Filter by AI using category chip
  const aiButton = screen.getByRole('button', { name: /Filter by AI/ });
  fireEvent.click(aiButton);
  await act(async () => { jest.advanceTimersByTime(350); });
  expect(screen.getByLabelText('catalog-grid')).toBeInTheDocument();
});

test('CourseDetail shows skeleton then modules & lessons', async () => {
  render(
    <MemoryRouter>
      <CourseDetail />
    </MemoryRouter>
  );
  await act(async () => { jest.advanceTimersByTime(350); });
  expect(screen.getByText(/Modules & Lessons/i)).toBeInTheDocument();
});

test('LessonPlayer shows viewport and Mark as Complete after loading', async () => {
  render(
    <MemoryRouter>
      <LessonPlayer />
    </MemoryRouter>
  );
  await act(async () => { jest.advanceTimersByTime(350); });
  expect(screen.getByLabelText(/lesson player viewport/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Mark as complete/i })).toBeInTheDocument();
});

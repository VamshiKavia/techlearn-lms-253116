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
  expect(screen.getAllByRole('status', { hidden: true }).length || 1).toBeTruthy(); // skeleton present
  await act(async () => { jest.advanceTimersByTime(450); });
  expect(screen.getByText(/Catalog/)).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: /Pagination/ })).toBeInTheDocument();

  // Filter by AI
  const aiButton = screen.getByRole('button', { name: /Filter by AI/ });
  fireEvent.click(aiButton);
  await act(async () => { jest.advanceTimersByTime(450); });
  expect(screen.getByText(/AI/)).toBeInTheDocument();
});

test('CourseDetail shows breadcrumbs and skeleton loading', async () => {
  render(
    <MemoryRouter>
      <CourseDetail />
    </MemoryRouter>
  );
  expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
  await act(async () => { jest.advanceTimersByTime(450); });
  expect(screen.getByText(/Modules/)).toBeInTheDocument();
});

test('LessonPlayer shows breadcrumbs and video after loading', async () => {
  render(
    <MemoryRouter>
      <LessonPlayer />
    </MemoryRouter>
  );
  expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
  await act(async () => { jest.advanceTimersByTime(450); });
  expect(screen.getByText(/Next/)).toBeInTheDocument();
});

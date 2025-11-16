import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProvidersMock from './providers-mock.jsx';
import StudentOverview from '../pages/student/StudentOverview.jsx';
import StudentMyLearning from '../pages/student/StudentMyLearning.jsx';
import LessonPlayer from '../pages/student/LessonPlayer.jsx';

function renderWithRoutes(initial = '/student/overview') {
  return ProvidersMock(
    <MemoryRouter initialEntries={[initial]}>
      <Routes>
        <Route path="/student/overview" element={<StudentOverview />} />
        <Route path="/student/my-learning" element={<StudentMyLearning />} />
        <Route path="/student/lesson/:lessonId" element={<LessonPlayer />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Student continue learning and notes', () => {
  it('shows Continue Learning on Overview and navigates to lesson', async () => {
    renderWithRoutes('/student/overview');
    expect(await screen.findByText(/Continue Learning/i)).toBeInTheDocument();

    const resumeButtons = screen.queryAllByRole('button', { name: /Resume/i });
    if (resumeButtons.length > 0) {
      fireEvent.click(resumeButtons[0]);
      // Should navigate to lesson player
      await waitFor(() => {
        expect(screen.getByRole('main', { name: /Lesson player/i })).toBeInTheDocument();
      });
    }
  });

  it('shows Continue Learning on My Learning', async () => {
    renderWithRoutes('/student/my-learning');
    expect(await screen.findByText(/Continue Learning/i)).toBeInTheDocument();
  });

  it('supports adding, editing and deleting notes in LessonPlayer', async () => {
    // use a known test lesson id route (fallback to generic id if not found handled by UI)
    renderWithRoutes('/student/lesson/lesson-1');

    // Add note
    const input = screen.getByLabelText(/Note text/i);
    fireEvent.change(input, { target: { value: 'My first note' } });
    fireEvent.click(screen.getByRole('button', { name: /Save note/i }));

    expect(await screen.findByText(/My first note/i)).toBeInTheDocument();

    // Edit note
    fireEvent.click(screen.getByRole('button', { name: /Edit note/i }));
    const editArea = screen.getByLabelText(/Edit note text/i);
    fireEvent.change(editArea, { target: { value: 'Updated note' } });
    fireEvent.click(screen.getByRole('button', { name: /Save note changes/i }));
    expect(await screen.findByText(/Updated note/i)).toBeInTheDocument();

    // Delete note
    fireEvent.click(screen.getByRole('button', { name: /Delete note/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Updated note/i)).not.toBeInTheDocument();
    });
  });

  it('toggles bookmark for lesson', async () => {
    renderWithRoutes('/student/lesson/lesson-2');
    const toggleBtn = await screen.findByRole('button', { name: /Bookmark|Remove bookmark/i });
    fireEvent.click(toggleBtn);
    // Button label should change
    const toggled = await screen.findByRole('button', { name: /Remove bookmark|Bookmarked/i });
    expect(toggled).toBeInTheDocument();
  });
});

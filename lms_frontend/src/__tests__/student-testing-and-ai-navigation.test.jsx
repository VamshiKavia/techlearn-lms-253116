import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import StudentSoftwareTesting from '../pages/student/StudentSoftwareTesting';
import StudentAI from '../pages/student/StudentAI';
import LessonPlayer from '../pages/student/LessonPlayer';

jest.useFakeTimers();

function renderStudentRouter(initialRoute = '/student/paths/testing') {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/student/paths/testing', element: <StudentSoftwareTesting /> },
              { path: '/student/paths/ai', element: <StudentAI /> },
              { path: '/student/courses/:courseId/lessons/:lessonId', element: <LessonPlayer /> },
            ],
          },
        ],
      },
      { path: '/login', element: <div>Login Page</div> },
    ],
    { initialEntries: [initialRoute] }
  );

  const authStudent = {
    user: { email: 'student@example.com', role: 'student' },
    role: 'student',
    logout: () => {},
  };

  return render(
    <AuthContext.Provider value={authStudent}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

describe('Video lesson links navigate to LessonPlayer', () => {
  test('Software Testing page lesson link navigates and renders LessonPlayer', async () => {
    renderStudentRouter('/student/paths/testing');

    const link = await screen.findByTestId('testing-lesson-mt-vid-1');
    fireEvent.click(link);

    await act(async () => { jest.advanceTimersByTime(350); });
    expect(await screen.findByLabelText(/lesson player viewport/i)).toBeInTheDocument();
  });

  test('AI page lesson link navigates and renders LessonPlayer', async () => {
    renderStudentRouter('/student/paths/ai');

    const link = await screen.findByTestId('ai-lesson-ai-vid-1');
    fireEvent.click(link);

    await act(async () => { jest.advanceTimersByTime(350); });
    expect(await screen.findByLabelText(/lesson player viewport/i)).toBeInTheDocument();
  });
}

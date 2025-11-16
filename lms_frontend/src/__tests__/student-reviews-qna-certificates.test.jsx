import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { AuthContext } from '../providers/AuthProvider';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Reviews from '../pages/student/Reviews';
import QnA from '../pages/student/QnA';
import Certificates from '../pages/student/Certificates';
import { createReviewsService } from '../services/reviewsService';
import { createQnaService } from '../services/qnaService';
import { createCertificatesService } from '../services/certificatesService';

function renderWithAuth(route, authValue) {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute allowedRoles={['student']} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/student/reviews', element: <Reviews /> },
              { path: '/student/qna', element: <QnA /> },
              { path: '/student/certificates', element: <Certificates /> },
            ],
          },
        ],
      },
      { path: '/login', element: <div>Login Page</div> },
      { path: '/', element: <div>Home</div> },
    ],
    { initialEntries: [route] }
  );
  return render(
    <AuthContext.Provider value={authValue}>
      <RouterProvider router={router} />
    </AuthContext.Provider>
  );
}

const services = {
  reviews: createReviewsService(null),
  qna: createQnaService(null),
  certificates: createCertificatesService(null),
};

const authStudent = {
  user: { email: 'student@example.com', role: 'student' },
  role: 'student',
  logout: () => {},
  services,
};

test('unauthenticated redirected to login for reviews', async () => {
  renderWithAuth('/student/reviews', { user: null, role: null, logout: () => {}, services });
  expect(await screen.findByText(/Login Page/i)).toBeInTheDocument();
});

test('renders Reviews page and allows submitting a review (mock)', async () => {
  renderWithAuth('/student/reviews', authStudent);
  expect(await screen.findByText(/Reviews/i)).toBeInTheDocument();

  // Submit a new review
  const courseInput = screen.getByLabelText(/Course ID/i);
  fireEvent.change(courseInput, { target: { value: 'c-fs-1' } });
  const ratingSelect = screen.getByLabelText(/Rating/i);
  fireEvent.change(ratingSelect, { target: { value: '5' } });
  const commentBox = screen.getByLabelText(/Comment/i);
  fireEvent.change(commentBox, { target: { value: 'Awesome!' } });

  const submitBtn = screen.getByRole('button', { name: /Submit Review/i });
  fireEvent.click(submitBtn);

  // After submission, item should be present in list (title or comment)
  expect(await screen.findByText(/Awesome!/i)).toBeInTheDocument();
});

test('renders Q&A page and allows posting a question (mock)', async () => {
  renderWithAuth('/student/qna', authStudent);
  expect(await screen.findByText(/Q&A/i)).toBeInTheDocument();

  const courseInput = screen.getByLabelText(/Course ID/i);
  fireEvent.change(courseInput, { target: { value: 'c-fs-1' } });
  const titleInput = screen.getByLabelText(/Title/i);
  fireEvent.change(titleInput, { target: { value: 'Test Question' } });
  const questionBox = screen.getByLabelText(/Question/i);
  fireEvent.change(questionBox, { target: { value: 'How do I proceed?' } });

  const postBtn = screen.getByRole('button', { name: /Post Question/i });
  fireEvent.click(postBtn);

  expect(await screen.findByText(/Test Question/i)).toBeInTheDocument();
});

test('renders Certificates page with mock items', async () => {
  renderWithAuth('/student/certificates', authStudent);
  expect(await screen.findByText(/Certificates/i)).toBeInTheDocument();
  // Some known certificates
  expect(await screen.findByText(/Full-Stack Development Certificate/i)).toBeInTheDocument();
});

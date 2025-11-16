import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProvidersMock from './providers-mock.jsx';
import StudentOverview from '../pages/student/StudentOverview.jsx';

describe('Breadcrumbs and active nav', () => {
  it('renders breadcrumbs on student overview', async () => {
    ProvidersMock(
      <MemoryRouter initialEntries={['/student/overview']}>
        <Routes>
          <Route path="/student/overview" element={<StudentOverview />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole('navigation', { name: /Breadcrumb/i })).toBeInTheDocument();
    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
  });
});

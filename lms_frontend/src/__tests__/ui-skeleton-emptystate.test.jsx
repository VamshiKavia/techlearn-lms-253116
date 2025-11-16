import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeleton, Skeleton } from '../components/ui/Skeleton';

test('EmptyState renders title and description', () => {
  render(<EmptyState title="No Data" description="Try again later" />);
  expect(screen.getByText('No Data')).toBeInTheDocument();
  expect(screen.getByText('Try again later')).toBeInTheDocument();
});

test('Skeleton components render with aria-hidden', () => {
  const { container } = render(
    <>
      <Skeleton />
      <CardSkeleton />
    </>
  );
  expect(container.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
});

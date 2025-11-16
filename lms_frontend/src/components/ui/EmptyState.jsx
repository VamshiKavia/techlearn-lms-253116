import React from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * Empty state component with optional action.
 */
const EmptyState = ({ title = 'Nothing here yet', description = 'Try adjusting filters or come back later.', actionLabel, onAction }) => {
  return (
    <div role="status" aria-live="polite" className="card p-6">
      <h2 className="h2 mb-2">{title}</h2>
      <p className="subtle mb-4">{description}</p>
      {actionLabel && <Button onClick={onAction} variant="primary" ariaLabel={actionLabel}>{actionLabel}</Button>}
    </div>
  );
};

export default EmptyState;

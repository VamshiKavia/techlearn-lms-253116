import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Generic skeleton loader block.
 */
export const Skeleton = ({ height = 16, width = '100%', className = '' }) => {
  const style = { height, width };
  return <div className={`skeleton ${className}`} style={style} aria-hidden="true" />;
};

/**
 * PUBLIC_INTERFACE
 * Card skeleton for loading lists/grids.
 */
export const CardSkeleton = () => (
  <div className="card p-6" aria-hidden="true">
    <div className="skeleton mb-3" style={{ height: 140, width: '100%', borderRadius: 8 }} />
    <div className="skeleton mb-2" style={{ height: 16, width: '70%' }} />
    <div className="skeleton mb-4" style={{ height: 12, width: '50%' }} />
    <div className="skeleton" style={{ height: 32, width: '30%' }} />
  </div>
);

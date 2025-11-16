import React from 'react';

/**
 * PUBLIC_INTERFACE
 * ProgressBar renders a simple horizontal progress indicator.
 */
export default function ProgressBar({ value = 0, ariaLabel = 'progress' }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div
      aria-label={ariaLabel}
      style={{
        height: 10,
        background: 'rgba(17,24,39,0.08)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${v}%`,
          height: '100%',
          background: 'var(--color-primary)',
          transition: 'width .3s ease',
        }}
      />
    </div>
  );
}

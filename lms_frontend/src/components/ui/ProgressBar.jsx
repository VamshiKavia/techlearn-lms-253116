import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Themed progress bar.
 */
export default function ProgressBar({ value = 0 }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} style={{ height: 10, overflow: 'hidden' }}>
      <div className="h-2 rounded" style={{ width: `${v}%`, height: '100%', background: 'var(--success)', transition: 'width .3s ease' }} />
    </div>
  );
}

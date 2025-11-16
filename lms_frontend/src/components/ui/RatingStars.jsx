import React from 'react';

/**
 * PUBLIC_INTERFACE
 * RatingStars renders a 0-5 star rating with half-step precision visually.
 */
export default function RatingStars({ value = 0, size = 14, color = 'var(--color-primary)', ariaLabel = 'rating' }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  const Star = ({ filled }) => (
    <span aria-hidden="true" style={{ color, fontSize: size, lineHeight: 1 }}>{filled ? '★' : '☆'}</span>
  );

  return (
    <span aria-label={ariaLabel} title={`${v} out of 5`} style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: full }).map((_, i) => <Star key={`f-${i}`} filled />)}
      {half ? <span style={{ position: 'relative', display: 'inline-block', width: size * 0.6 }}>
        <span style={{ position: 'absolute', left: 0, top: 0, width: '50%', overflow: 'hidden' }}>
          <span style={{ color, fontSize: size }}>★</span>
        </span>
        <span style={{ color: 'rgba(17,24,39,0.2)', fontSize: size }}>☆</span>
      </span> : null}
      {Array.from({ length: empty }).map((_, i) => <Star key={`e-${i}`} />)}
      <span style={{ marginLeft: 6, fontSize: 12, color: 'var(--color-secondary)' }}>{v.toFixed(1)}</span>
    </span>
  );
}

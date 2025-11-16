import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Star rating display supporting theme styles.
 */
export default function RatingStars({ value = 0, size = 14 }) {
  const rating = Math.max(0, Math.min(5, Number(value) || 0));
  const stars = Math.round(rating);
  return (
    <div className="star-active" aria-label={`Rating ${rating} out of 5`} title={`${rating} out of 5`} style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} aria-hidden="true" style={{ fontSize: size, lineHeight: 1 }}>
          {i < stars ? '★' : '☆'}
        </span>
      ))}
      <span style={{ marginLeft: 6, fontSize: 12, color: 'var(--secondary)' }}>{rating.toFixed(1)}</span>
    </div>
  );
}

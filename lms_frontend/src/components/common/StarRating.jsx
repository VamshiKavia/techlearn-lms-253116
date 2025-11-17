import React from 'react';

/**
 * PUBLIC_INTERFACE
 * StarRating: Displays filled stars from rating (0-5)
 * @param {object} props
 * @param {number} props.value
 */
export function StarRating({ value = 0 }) {
  const stars = Array.from({ length: 5 }).map((_, i) => i < value);
  return (
    <div aria-label={`rating ${value} of 5`} style={{ display: 'inline-flex', gap: 2 }}>
      {stars.map((filled, idx) => (
        <span key={idx} role="img" aria-hidden="true" style={{ color: 'var(--rating-star)' }}>
          {filled ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

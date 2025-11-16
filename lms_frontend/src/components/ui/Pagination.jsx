import React from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * Pagination control with accessible labels.
 */
export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 1)));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const go = (p) => {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  };

  return (
    <nav aria-label="Pagination" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
      <Button variant="ghost" onClick={() => go(1)} disabled={!canPrev} ariaLabel="First page">«</Button>
      <Button variant="ghost" onClick={() => go(page - 1)} disabled={!canPrev} ariaLabel="Previous page">‹</Button>
      <span style={{ fontSize: 12, color: 'var(--secondary)' }}>
        Page {page} of {totalPages}
      </span>
      <Button variant="ghost" onClick={() => go(page + 1)} disabled={!canNext} ariaLabel="Next page">›</Button>
      <Button variant="ghost" onClick={() => go(totalPages)} disabled={!canNext} ariaLabel="Last page">»</Button>
    </nav>
  );
}

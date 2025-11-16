import React from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * Pagination renders simple previous/next controls and page info.
 */
export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 1)));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
      <Button variant="ghost" onClick={() => onPageChange(1)} disabled={!canPrev} aria-label="first page">
        «
      </Button>
      <Button variant="ghost" onClick={() => onPageChange(page - 1)} disabled={!canPrev} aria-label="previous page">
        ‹
      </Button>
      <span style={{ fontSize: 12, color: 'var(--color-secondary)' }}>
        Page {page} of {totalPages}
      </span>
      <Button variant="ghost" onClick={() => onPageChange(page + 1)} disabled={!canNext} aria-label="next page">
        ›
      </Button>
      <Button variant="ghost" onClick={() => onPageChange(totalPages)} disabled={!canNext} aria-label="last page">
        »
      </Button>
    </div>
  );
}

import React from 'react';

/**
 * PUBLIC_INTERFACE
 * SearchInput: debounced search input shell (debounce handled by caller)
 * @param {object} props
 * @param {string} props.value
 * @param {(val:string)=>void} props.onChange
 * @param {string} [props.placeholder]
 */
export function SearchInput({ value, onChange, placeholder = 'Search courses…' }) {
  return (
    <input
      aria-label="Search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        height: 40,
        padding: '8px 12px',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        width: '100%',
        maxWidth: 360,
        background: 'var(--bg-panel)',
        color: 'var(--text-primary)',
        outline: 'none',
        boxShadow: '0 0 0 0 rgba(0,0,0,0)',
      }}
      onFocus={(e) => {
        e.target.style.boxShadow = `0 0 0 3px rgba(147,197,253,0.7)`; /* blue-300 */
        e.target.style.borderColor = '#93C5FD';
        e.target.style.background = 'var(--bg-canvas)';
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = '0 0 0 0 rgba(0,0,0,0)';
        e.target.style.borderColor = 'var(--border-subtle)';
        e.target.style.background = 'var(--bg-panel)';
      }}
    />
  );
}

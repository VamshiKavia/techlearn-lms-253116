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
      className="ui-input"
      style={{ height: 40, width: '100%', maxWidth: 360 }}
    />
  );
}

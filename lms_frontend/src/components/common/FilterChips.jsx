import React from 'react';

/**
 * PUBLIC_INTERFACE
 * FilterChips: pill-based selector
 * @param {object} props
 * @param {string[]} props.options
 * @param {string} props.value
 * @param {(val:string)=>void} props.onChange
 */
export function FilterChips({ options = [], value, onChange }) {
  return (
    <div className="filters">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            className={`btn btn-outline btn-chip ${active ? 'active' : ''}`}
            onClick={() => onChange(opt)}
            aria-pressed={active}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

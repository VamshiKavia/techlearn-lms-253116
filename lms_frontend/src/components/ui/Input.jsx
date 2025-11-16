import React from 'react';

// PUBLIC_INTERFACE
export default function Input({ label, error, ...rest }) {
  /** Minimal input with label and error. */
  return (
    <div style={{ display: 'grid', gap: 6 }}>
      {label ? <label style={{ fontSize: 14 }}>{label}</label> : null}
      <input className="input" {...rest} />
      {error ? <div style={{ color: 'var(--color-error)', fontSize: 12 }}>{error}</div> : null}
    </div>
  );
}

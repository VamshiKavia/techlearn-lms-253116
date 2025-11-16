import React from 'react';

// PUBLIC_INTERFACE
export default function Card({ children, style }) {
  /** Minimal card container. */
  return <div className="card" style={style}>{children}</div>;
}

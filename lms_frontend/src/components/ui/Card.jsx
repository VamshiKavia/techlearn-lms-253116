import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Themed Card surface container.
 */
export default function Card({ children, className = '', style, role, onClick }) {
  return (
    <div className={`card ${className}`} style={style} role={role} onClick={onClick}>
      {children}
    </div>
  );
}

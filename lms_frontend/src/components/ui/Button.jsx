import React from 'react';

// PUBLIC_INTERFACE
export default function Button({ children, variant = 'primary', ...rest }) {
  /** Minimal button using theme classes. */
  const cls = ['btn', variant === 'secondary' ? 'secondary' : '', variant === 'ghost' ? 'ghost' : '']
    .filter(Boolean)
    .join(' ');
  return <button className={cls} {...rest}>{children}</button>;
}

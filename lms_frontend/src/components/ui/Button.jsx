import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Accessible, themed Button with variants.
 */
export default function Button({
  children,
  variant = 'primary',
  disabled = false,
  ariaLabel,
  className = '',
  type = 'button',
  onClick,
  ...rest
}) {
  const cls = ['btn'];
  if (variant === 'secondary') cls.push('secondary');
  if (variant === 'ghost') cls.push('ghost');
  const finalClass = cls.concat(className ? [className] : []).join(' ');
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={finalClass}
      {...rest}
    >
      {children}
    </button>
  );
}

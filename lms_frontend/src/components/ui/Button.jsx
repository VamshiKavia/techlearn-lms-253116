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
  const base = 'btn focus:outline-none focus:ring-2 focus:ring-gray-400';
  const variantClass =
    variant === 'secondary'
      ? 'secondary'
      : variant === 'ghost'
      ? 'ghost'
      : variant === 'danger'
      ? 'danger'
      : '';
  const finalClass = [base, variantClass, className].filter(Boolean).join(' ');
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

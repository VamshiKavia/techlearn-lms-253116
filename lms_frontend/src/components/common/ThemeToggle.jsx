import React, { useContext } from 'react';
import { ThemeContext } from '../../core/theme/ThemeContext';

/**
 * PUBLIC_INTERFACE
 * ThemeToggle renders a small accessible toggle button to switch light/dark mode.
 *
 * Keyboard: Space/Enter to toggle.
 * A11y: aria-pressed announced state; clear label.
 */
export default function ThemeToggle({ size = 32 }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  const styles = {
    button: {
      width: size,
      height: size,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      border: '1px solid var(--color-border)',
      background: 'var(--color-elevated)',
      color: 'var(--color-text)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'background-color 150ms ease, box-shadow 150ms ease',
    },
    icon: {
      display: 'block',
    },
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      onClick={toggleTheme}
      className="theme-toggle btn"
      style={styles.button}
    >
      {/* Simple sun/moon icons using inline SVG to avoid adding dependencies */}
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={styles.icon} aria-hidden="true">
          <path d="M21.64 13a1 1 0 0 0-1.05-.14 8 8 0 1 1-9.45-9.45 1 1 0 0 0-.14-1.05 1 1 0 0 0-1.09-.3 10 10 0 1 0 12.03 12.03 1 1 0 0 0-.3-1.09z"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={styles.icon} aria-hidden="true">
          <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.79 1.8-1.79zm10.48 14.32l1.79 1.8 1.79-1.8-1.79-1.79-1.79 1.79zM12 4a1 1 0 0 1-1-1V1h2v2a1 1 0 0 1-1 1zm0 16a1 1 0 0 1 1 1v2h-2v-2a1 1 0 0 1 1-1zM4 13a1 1 0 0 1-1-1H1v2h2a1 1 0 0 1 1-1zm18-1a1 1 0 0 1-1 1h2v-2h-2a1 1 0 0 1 1 1zM6.76 19.16l-1.8 1.79-1.79-1.79 1.79-1.79 1.8 1.79zM19.16 6.76l1.79-1.8-1.79-1.79-1.79 1.79 1.79 1.8zM12 8a4 4 0 1 0 .001 8.001A4 4 0 0 0 12 8z"/>
        </svg>
      )}
    </button>
  );
}

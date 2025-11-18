import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * ThemeContext provides global theme state and actions.
 * - Respects prefers-color-scheme on first load.
 * - Persists user choice in localStorage.
 * - Applies theme via document.documentElement.dataset.theme.
 */
export const ThemeContext = createContext({
  theme: 'light',
  // PUBLIC_INTERFACE
  setTheme: (mode) => {},
  // PUBLIC_INTERFACE
  toggleTheme: () => {},
});

/**
 * PUBLIC_INTERFACE
 * ThemeProvider wraps the app and manages light/dark mode.
 * Env/config: no external env required.
 */
export function ThemeProvider({ children }) {
  const STORAGE_KEY = 'ui.theme';

  const getPreferred = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {
      // ignore storage errors
    }
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.matches) return 'dark';
    }
    return 'light'; // default
  };

  const [theme, setThemeState] = useState(getPreferred);

  const applyTheme = useCallback((mode) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    // Maintain high-contrast for selection
    root.style.colorScheme = mode;
  }, []);

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // ignore storage errors
    }
  }, [theme, applyTheme]);

  // Respect prefers-color-scheme changes when user hasn't explicitly chosen
  useEffect(() => {
    const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    if (!mq) return;
    const handler = (e) => {
      const saved = (() => {
        try {
          return localStorage.getItem(STORAGE_KEY);
        } catch {
          return null;
        }
      })();
      // Only auto-switch if no saved preference
      if (saved !== 'light' && saved !== 'dark') {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', handler) : mq.removeListener(handler);
    };
  }, []);

  const setTheme = useCallback((mode) => {
    setThemeState(mode === 'dark' ? 'dark' : 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

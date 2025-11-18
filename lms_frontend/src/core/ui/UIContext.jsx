import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * UIContext provides global UI state (e.g., sidebar open/closed) and actions.
 *
 * - Stores `isSidebarOpen` in state (not persisted).
 * - Defaults: on desktop (>=1024px) open by default; on mobile closed by default.
 * - Provides actions: openSidebar, closeSidebar, toggleSidebar.
 * - Listens to window resize to keep desktop expanded by default.
 * - Respects reduced motion: consumers should check prefers-reduced-motion for animations.
 */
const UIContext = createContext(null);

// PUBLIC_INTERFACE
export function UIProvider({ children }) {
  const getInitial = () => {
    if (typeof window === 'undefined') return false;
    // Default: desktop open, mobile closed
    const isDesktop = window.matchMedia && window.matchMedia('(min-width: 1024px)').matches;
    return !!isDesktop;
  };

  const [isSidebarOpen, setSidebarOpen] = useState(getInitial);

  // Keep default behavior when crossing responsive breakpoints
  useEffect(() => {
    const mq = window.matchMedia ? window.matchMedia('(min-width: 1024px)') : null;
    if (!mq) return;
    const handler = (e) => {
      if (e.matches) {
        // Desktop: open by default
        setSidebarOpen(true);
      } else {
        // Mobile: closed by default
        setSidebarOpen(false);
      }
    };
    mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener('change', handler) : mq.removeListener(handler);
    };
  }, []);

  // PUBLIC_INTERFACE
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  // PUBLIC_INTERFACE
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  // PUBLIC_INTERFACE
  const toggleSidebar = useCallback(() => setSidebarOpen((v) => !v), []);

  const value = useMemo(
    () => ({ isSidebarOpen, openSidebar, closeSidebar, toggleSidebar }),
    [isSidebarOpen, openSidebar, closeSidebar, toggleSidebar]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// PUBLIC_INTERFACE
export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}

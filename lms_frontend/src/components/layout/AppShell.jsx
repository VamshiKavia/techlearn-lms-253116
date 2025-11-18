import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useUI } from '../../core/ui/UIContext';

/**
 * PUBLIC_INTERFACE
 * AppShell: Provides sidebar, topbar, and main content region layout.
 * - Uses UIContext.isSidebarOpen to orchestrate sidebar slide and content push/resize.
 * - Desktop (>=1024px): sidebar pushes content using transform for smooth 300ms ease-in-out.
 * - Mobile (<1024px): sidebar overlays content; content stays full-width; scrim closes sidebar.
 * @param {object} props
 * @param {React.ReactNode} props.children - Main content
 */
export function AppShell({ children }) {
  const { isSidebarOpen, closeSidebar } = useUI();

  // Root classes toggle modifiers for CSS-based transitions
  const rootClass = `app ${isSidebarOpen ? 'is-sidebar-open' : 'is-sidebar-closed'}`;

  return (
    <div className={rootClass}>
      <aside
        className="sidebar-panel"
        role="navigation"
        aria-label="Primary"
        aria-hidden={!isSidebarOpen}
      >
        <Sidebar />
      </aside>

      {/* Scrim overlay for mobile. Click to close. Hidden on desktop via CSS. */}
      <button
        type="button"
        className={`scrim ${isSidebarOpen ? 'visible' : ''}`}
        aria-label="Close sidebar"
        onClick={closeSidebar}
      />

      <header className="topbar">
        <Topbar />
      </header>

      {/* Main wrapper receives a modifier to animate transform/width on desktop.
          Prefer transform for performance; width updates are included for completeness. */}
      <main
        className={`main motion-page-enter ${isSidebarOpen ? 'with-sidebar' : 'without-sidebar'}`}
        id="content"
      >
        <div className="motion-section-enter">
          {children}
        </div>
      </main>
    </div>
  );
}

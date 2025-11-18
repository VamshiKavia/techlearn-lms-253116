import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useUI } from '../../core/ui/UIContext';

/**
 * PUBLIC_INTERFACE
 * AppShell: Provides the responsive app layout with a sidebar, topbar, and main content area.
 * When the sidebar is closed, the main content expands to full viewport width/height.
 * When open, the sidebar occupies a fixed width and the main uses the remaining space.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Main content to render inside the layout
 */
export function AppShell({ children }) {
  const { isSidebarOpen, closeSidebar } = useUI();

  // Root state class controls CSS grid, transforms, and transitions
  const rootClass = `app ${isSidebarOpen ? 'is-sidebar-open' : 'is-sidebar-closed'}`;

  return (
    <div className={rootClass}>
      {/* Sidebar container stays transparent and inherits page background */}
      <aside
        className="sidebar-panel"
        role="navigation"
        aria-label="Primary"
        aria-hidden={!isSidebarOpen}
        // When closed, prevent interaction and hide from screen readers and focus navigation
        style={{
          visibility: isSidebarOpen ? 'visible' : 'hidden',
          pointerEvents: isSidebarOpen ? 'auto' : 'none',
        }}
      >
        {/* Mark inner content region so CSS can optionally set display:none at small breakpoints post-transition */}
        <div
          className="sidebar-content"
          aria-hidden={!isSidebarOpen}
        >
          <Sidebar />
        </div>
      </aside>

      {/* Mobile scrim appears when sidebar is open; hidden on desktop */}
      <button
        type="button"
        className={`scrim ${isSidebarOpen ? 'visible' : ''}`}
        aria-label="Close sidebar"
        onClick={closeSidebar}
      />

      {/* Topbar placed in the grid second column on desktop, first on mobile */}
      <header className="topbar" role="banner">
        <Topbar />
      </header>

      {/* Main always present. On mobile with sidebar closed, spans full width (100vw x 100vh by grid sizing). */}
      <main className="main motion-page-enter" id="content" role="main" tabIndex={-1}>
        <div className="motion-section-enter">
          {children}
        </div>
      </main>
    </div>
  );
}

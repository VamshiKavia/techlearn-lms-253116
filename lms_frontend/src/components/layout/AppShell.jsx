import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useUI } from '../../core/ui/UIContext';

/**
 * PUBLIC_INTERFACE
 * AppShell: Provides sidebar, topbar, and main content region layout.
 * @param {object} props
 * @param {React.ReactNode} props.children - Main content
 */
export function AppShell({ children }) {
  const { isSidebarOpen, closeSidebar } = useUI();

  // Root classes toggle a modifier for CSS to slide the sidebar and show overlay on mobile
  const rootClass = `app ${isSidebarOpen ? 'is-sidebar-open' : 'is-sidebar-closed'}`;

  return (
    <div className={rootClass}>
      <aside className="sidebar-panel" role="navigation" aria-label="Primary" aria-hidden={!isSidebarOpen}>
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
      <main className="main motion-page-enter" id="content">
        <div className="motion-section-enter">
          {children}
        </div>
      </main>
    </div>
  );
}

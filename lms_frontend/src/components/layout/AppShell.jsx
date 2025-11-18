import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

/**
 * PUBLIC_INTERFACE
 * AppShell: Provides sidebar, topbar, and main content region layout.
 * @param {object} props
 * @param {React.ReactNode} props.children - Main content
 */
export function AppShell({ children }) {
  return (
    <div className="app">
      <aside className="sidebar" role="navigation" aria-label="Primary">
        <Sidebar />
      </aside>
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

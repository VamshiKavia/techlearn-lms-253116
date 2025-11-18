import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Remove any leftover neon initialization and variables (if previously set)
if (typeof document !== 'undefined') {
  const rootEl = document.documentElement;
  const bodyEl = document.body;
  // Remove neon flags/variables
  rootEl.style.removeProperty('--neon-bg');
  rootEl.style.removeProperty('--neon-primary');
  rootEl.style.removeProperty('--neon-accent');
  rootEl.style.removeProperty('--neon-surface');
  rootEl.style.removeProperty('--neon-surface-2');
  rootEl.style.removeProperty('--neon-glow');
  rootEl.removeAttribute('data-neon-enabled');
  // Remove background URL var if set
  bodyEl && bodyEl.style.removeProperty('--neon-bg-url');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

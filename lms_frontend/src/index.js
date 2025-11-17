import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Clear, single dev log confirming CRA env ingestion for Supabase
(function devStartupBanner() {
  try {
    const isProd = process.env.NODE_ENV === 'production';
    const url = (process.env.REACT_APP_SUPABASE_URL || '').trim();
    const key = (process.env.REACT_APP_SUPABASE_KEY || '').trim();
    const banner = {
      envMode: 'REACT_APP',
      urlPresent: !!url,
      keyPresent: !!key,
    };
    if (!isProd) {
      // eslint-disable-next-line no-console
      console.info('[Startup] CRA env check', banner);
    }
  } catch {
    // no-op
  }
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

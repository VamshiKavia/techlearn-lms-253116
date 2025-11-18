import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Imports neon theme and global background layers
import { applyNeonBackground } from './lib/applyNeonBackground';
import App from './App';

applyNeonBackground();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

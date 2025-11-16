import React from 'react';
import './styles/theme.css';
import { AuthProvider } from './providers/AuthProvider';
import AppRoutes from './routes/AppRoutes';

// PUBLIC_INTERFACE
function App() {
  /** Root app mounting providers and routes. */
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;

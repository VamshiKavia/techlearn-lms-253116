import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import './styles/theme.css';
import './styles/layout.css';
import { AppShell } from './components/layout/AppShell';
import { StudentOverviewPage } from './pages/student/StudentOverviewPage';
import { CatalogPage } from './pages/common/CatalogPage';
import { CategorySectionsPage } from './pages/common/CategorySectionsPage';
import { PlayerPage } from './pages/common/PlayerPage';
import { AuthProvider } from './core/auth/AuthContext';
import { FullStackDevelopment } from './pages/student/FullStackDevelopment';
import { Reviews } from './pages/student/Reviews';
import { Certificates } from './pages/student/Certificate';

/**
 * PUBLIC_INTERFACE
 * App: Root application with student-only routing.
 * Uses environment variables for backend and Supabase client configuration (see core/clients/*).
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell>
          <Routes>
            {/* Student routes (default) */}
            <Route path="/" element={<Navigate to="/student/overview" replace />} />
            <Route path="/student/overview" element={<StudentOverviewPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/:category" element={<CategorySectionsPage />} />
            <Route path="/player/:lessonId" element={<PlayerPage />} />
            <Route path="/full-stack" element={<FullStackDevelopment />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/certificates" element={<Certificates />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/student/overview" replace />} />
          </Routes>
        </AppShell>
      </Router>
    </AuthProvider>
  );
}

export default App;

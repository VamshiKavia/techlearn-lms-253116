import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './index.css';
import './styles/theme.css';
import './styles/layout.css';
import { AppShell } from './components/layout/AppShell';
import { StudentOverviewPage } from './pages/student/StudentOverviewPage';
import { CatalogPage } from './pages/common/CatalogPage';
import { CategorySectionsPage } from './pages/common/CategorySectionsPage';
import { PlayerPage } from './pages/common/PlayerPage';
import { AuthProvider, useAuth } from './core/auth/AuthContext';
import { SupabaseDevHealthCheck } from './lib/SupabaseDevHealthCheck';
import { FullStackDevelopment } from './pages/student/FullStackDevelopment';
import { Reviews } from './pages/student/Reviews';
import { Certificates } from './pages/student/Certificate';
import { Login } from './pages/auth/Login';
import { LoginRegister } from './pages/auth/LoginRegister';
import { Account } from './pages/account/Account';

/**
 * ProtectedRoute: Guards child element behind auth; redirects to /auth with return path.
 */
function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  // Avoid redirecting while we are still checking existing session
  if (initializing) {
    return (
      <div style={{ padding: 24 }}>
        <div className="card" style={{ padding: 16, borderRadius: 12 }}>
          Checking session…
        </div>
      </div>
    );
  }

  if (!user) {
    const ret = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?redirect=${ret}`} replace />;
  }
  return children;
}

/**
 * PUBLIC_INTERFACE
 * App: Root application routing.
 * Includes public auth routes and protected student routes.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Dev-only Supabase health check: logs to console without UI changes */}
        <SupabaseDevHealthCheck />
        <AppShell>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<LoginRegister />} />

            {/* Default route redirects to student overview (protected) */}
            <Route path="/" element={<Navigate to="/student/overview" replace />} />

            {/* Protected student/content routes */}
            <Route
              path="/student/overview"
              element={
                <ProtectedRoute>
                  <StudentOverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/catalog"
              element={
                <ProtectedRoute>
                  <CatalogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/catalog/:category"
              element={
                <ProtectedRoute>
                  <CategorySectionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/player/:lessonId"
              element={
                <ProtectedRoute>
                  <PlayerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/full-stack"
              element={
                <ProtectedRoute>
                  <FullStackDevelopment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reviews"
              element={
                <ProtectedRoute>
                  <Reviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <ProtectedRoute>
                  <Certificates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/student/overview" replace />} />
          </Routes>
        </AppShell>
      </Router>
    </AuthProvider>
  );
}

export default App;

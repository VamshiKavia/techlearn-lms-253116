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
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { InstructorDashboard } from './pages/instructor/InstructorDashboard';
import { AuthProvider } from './core/auth/AuthContext';
import { RequireRole } from './core/auth/RequireRole';
import { RolesTabbedPage } from './pages/common/RolesTabbedPage';

/**
 * PUBLIC_INTERFACE
 * App: Root application with routing and role-based layouts.
 * Uses environment variables for backend and Supabase client configuration (see core/clients/*).
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppShell>
          <Routes>
            {/* Student routes */}
            <Route path="/" element={<Navigate to="/student/overview" replace />} />
            <Route path="/student/overview" element={<StudentOverviewPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/catalog/:category" element={<CategorySectionsPage />} />
            <Route path="/player/:lessonId" element={<PlayerPage />} />
            <Route path="/roles" element={<RolesTabbedPage />} />

            {/* Admin & Instructor dashboards - gated by role */}
            <Route
              path="/admin"
              element={
                <RequireRole roles={['admin']}>
                  <AdminDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/instructor"
              element={
                <RequireRole roles={['instructor']}>
                  <InstructorDashboard />
                </RequireRole>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<div style={{ padding: 24 }}>Page not found</div>} />
          </Routes>
        </AppShell>
      </Router>
    </AuthProvider>
  );
}

export default App;

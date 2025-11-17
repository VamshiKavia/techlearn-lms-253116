import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RoleManagement } from './RoleManagement';

/**
 * PUBLIC_INTERFACE
 * AdminDashboard: Root container for Admin routes.
 * Default page is Roles (/admin/roles).
 */
export function AdminDashboard() {
  return (
    <Routes>
      {/* Default redirect to roles */}
      <Route index element={<Navigate to="roles" replace />} />
      <Route path="roles" element={<RoleManagement />} />
      {/* Future admin routes can be added here */}
      <Route path="*" element={<Navigate to="roles" replace />} />
    </Routes>
  );
}

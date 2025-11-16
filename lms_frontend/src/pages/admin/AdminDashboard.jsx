import React from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';

// PUBLIC_INTERFACE
export default function AdminDashboard() {
  /** Admin Dashboard wrapper rendering the role sidebar and nested routes via Outlet. */
  return <DashboardLayout />;
}

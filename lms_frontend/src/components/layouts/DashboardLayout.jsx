import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function DashboardLayout() {
  /** Shared dashboard layout with role sections and sidebar navigation */
  const location = useLocation();
  const NavItem = ({ to, label }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`block px-3 py-2 rounded ${active ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`}
      >
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen p-4">
          <div className="text-gray-800 font-semibold mb-3">Admin</div>
          <nav className="space-y-1">
            <NavItem to="/admin/overview" label="Overview" />
            <NavItem to="/admin/users" label="Users" />
            <NavItem to="/admin/courses" label="Courses" />
            <NavItem to="/admin/enrollments" label="Enrollments" />
          </nav>

          <div className="text-gray-800 font-semibold mt-6 mb-3">Instructor</div>
          <nav className="space-y-1">
            <NavItem to="/instructor/overview" label="Overview" />
            <NavItem to="/instructor/courses" label="Courses" />
            <NavItem to="/instructor/create-course" label="Create Course" />
          </nav>

          <div className="text-gray-800 font-semibold mt-6 mb-3">Student</div>
          <nav className="space-y-1">
            <NavItem to="/student/overview" label="Overview" />
            <NavItem to="/student/catalog" label="Catalog" />
            <NavItem to="/student/mylearning" label="My Learning" />
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

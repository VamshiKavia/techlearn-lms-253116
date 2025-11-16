import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

/**
 * PUBLIC_INTERFACE
 * DashboardLayout - Sidebar navigation and content wrapper with concise menus for each role.
 */
const DashboardLayout = () => {
  const { user } = useAuth();

  const isStudent = user?.role?.toLowerCase?.() === 'student';
  const isInstructor = user?.role?.toLowerCase?.() === 'instructor';
  const isAdmin = user?.role?.toLowerCase?.() === 'admin';

  const itemClass = ({ isActive }) =>
    `block px-3 py-2 rounded ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 hidden md:block bg-white border-r min-h-screen">
          <div className="p-4 text-lg font-semibold text-gray-800">TechLearn</div>
          <nav className="p-2 space-y-1">
            {isStudent && (
              <>
                <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wider text-gray-400">
                  Student
                </div>
                <NavLink to="/student/overview" className={itemClass}>
                  Overview
                </NavLink>
                <NavLink to="/student/courses" className={itemClass}>
                  My Learning
                </NavLink>
                <NavLink to="/student/catalog" className={itemClass}>
                  Catalog
                </NavLink>
                <NavLink to="/student/certificates" className={itemClass}>
                  Certificates
                </NavLink>
              </>
            )}
            {isInstructor && (
              <>
                <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wider text-gray-400">
                  Instructor
                </div>
                <NavLink to="/instructor/overview" className={itemClass}>
                  Overview
                </NavLink>
                <NavLink to="/instructor/courses" className={itemClass}>
                  My Courses
                </NavLink>
                <NavLink to="/instructor/submissions" className={itemClass}>
                  Submissions
                </NavLink>
              </>
            )}
            {isAdmin && (
              <>
                <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wider text-gray-400">Admin</div>
                <NavLink to="/admin/overview" className={itemClass}>
                  Overview
                </NavLink>
                <NavLink to="/admin/users" className={itemClass}>
                  Users
                </NavLink>
                <NavLink to="/admin/courses" className={itemClass}>
                  Courses
                </NavLink>
                <NavLink to="/admin/enrollments" className={itemClass}>
                  Enrollments
                </NavLink>
              </>
            )}
          </nav>
        </aside>
        <main className="flex-1">
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';

/**
 * PUBLIC_INTERFACE
 * DashboardLayout - Sidebar navigation and content wrapper with concise menus for each role.
 * Includes active styles, aria-current, and focus rings for accessibility.
 */
const DashboardLayout = () => {
  const { user } = useAuth();

  const isStudent = user?.role?.toLowerCase?.() === 'student';
  const isInstructor = user?.role?.toLowerCase?.() === 'instructor';
  const isAdmin = user?.role?.toLowerCase?.() === 'admin';

  const itemClass = ({ isActive }) =>
    `block px-3 py-2 rounded outline-none focus:ring-2 focus:ring-gray-400 ${isActive ? 'bg-gray-200 text-gray-900' : 'text-gray-700 hover:bg-gray-100'}`;

  const Item = ({ to, children }) => (
    <NavLink to={to} className={itemClass} aria-current={({ isActive }) => (isActive ? 'page' : undefined)}>
      {children}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 hidden md:block bg-white border-r min-h-screen" role="navigation" aria-label="App navigation">
          <div className="p-4 text-lg font-semibold text-gray-800">TechLearn</div>
          <nav className="p-2 space-y-1">
            {isStudent && (
              <>
                <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wider text-gray-400">
                  Student
                </div>
                <Item to="/student/overview">Overview</Item>
                <Item to="/student/courses">My Learning</Item>
                <Item to="/student/catalog">Catalog</Item>
                <Item to="/student/certificates">Certificates</Item>
              </>
            )}
            {isInstructor && (
              <>
                <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wider text-gray-400">
                  Instructor
                </div>
                <Item to="/instructor/overview">Overview</Item>
                <Item to="/instructor/courses">My Courses</Item>
                <Item to="/instructor/submissions">Submissions</Item>
              </>
            )}
            {isAdmin && (
              <>
                <div className="px-3 pt-2 pb-1 text-xs uppercase tracking-wider text-gray-400">Admin</div>
                <Item to="/admin/overview">Overview</Item>
                <Item to="/admin/users">Users</Item>
                <Item to="/admin/courses">Courses</Item>
                <Item to="/admin/enrollments">Enrollments</Item>
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

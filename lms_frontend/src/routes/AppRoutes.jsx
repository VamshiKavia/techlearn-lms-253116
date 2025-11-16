import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import { ProtectedRoute } from './ProtectedRoute';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminCourses from '../pages/admin/AdminCourses';
import AdminOverview from '../pages/admin/AdminOverview';

import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import InstructorCourses from '../pages/instructor/InstructorCourses';
import InstructorCreateCourse from '../pages/instructor/InstructorCreateCourse';

import StudentDashboard from '../pages/student/StudentDashboard';
import StudentCourses from '../pages/student/StudentCourses';

// PUBLIC_INTERFACE
export default function AppRoutes() {
  /** Sets up router with public and protected role routes. */
  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        { path: '/', element: <Home /> },
        { path: '/login', element: <Login /> },
        { path: '/signup', element: <Signup /> },
      ],
    },
    {
      element: <ProtectedRoute allowedRoles={['admin']} />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { path: '/admin', element: <AdminOverview /> },
            { path: '/admin/overview', element: <AdminOverview /> },
            { path: '/admin/courses', element: <AdminCourses /> },
          ],
        },
      ],
    },
    {
      element: <ProtectedRoute allowedRoles={['instructor']} />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { path: '/instructor', element: <InstructorDashboard /> },
            { path: '/instructor/courses', element: <InstructorCourses /> },
            { path: '/instructor/courses/new', element: <InstructorCreateCourse /> },
          ],
        },
      ],
    },
    {
      element: <ProtectedRoute allowedRoles={['student']} />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { path: '/student', element: <StudentDashboard /> },
            { path: '/student/courses', element: <StudentCourses /> },
            { path: '/student/catalog', element: <StudentCourses /> },
          ],
        },
      ],
    },
    { path: '*', element: <NotFound /> },
  ]);

  return <RouterProvider router={router} />;
}

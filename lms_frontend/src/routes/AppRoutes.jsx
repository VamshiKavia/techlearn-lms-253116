import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import DashboardLayout from '../components/layouts/DashboardLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';

// Student pages
import StudentOverview from '../pages/student/StudentOverview';
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentCourses from '../pages/student/StudentCourses';
import StudentCatalog from '../pages/student/StudentCatalog';
import StudentCertificates from '../pages/student/Certificates';

// Instructor pages
import InstructorOverview from '../pages/instructor/InstructorOverview';
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import InstructorCourses from '../pages/instructor/InstructorCourses';
import InstructorCreateCourse from '../pages/instructor/InstructorCreateCourse';
import InstructorSubmissions from '../pages/instructor/InstructorSubmissions';

// Admin pages
import AdminOverview from '../pages/admin/AdminOverview';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCourses from '../pages/admin/AdminCourses';
import AdminEnrollments from '../pages/admin/AdminEnrollments';

/**
 * PUBLIC_INTERFACE
 * AppRoutes - Defines app routes with role-protected admin/instructor/student areas.
 */
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        <Route
          element={
            <ProtectedRoute roles={['student', 'instructor', 'admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Student */}
          <Route path="student/overview" element={<StudentOverview />} />
          <Route path="student/courses" element={<StudentCourses />} />
          <Route path="student/catalog" element={<StudentCatalog />} />
          <Route path="student/certificates" element={<StudentCertificates />} />

          {/* Instructor */}
          <Route element={<ProtectedRoute roles={['instructor']} />}>
            <Route path="instructor/overview" element={<InstructorOverview />} />
            <Route path="instructor/courses" element={<InstructorCourses />} />
            <Route path="instructor/courses/create" element={<InstructorCreateCourse />} />
            <Route path="instructor/submissions" element={<InstructorSubmissions />} />
          </Route>

          {/* Admin */}
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="admin/overview" element={<AdminOverview />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/courses" element={<AdminCourses />} />
            <Route path="admin/enrollments" element={<AdminEnrollments />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

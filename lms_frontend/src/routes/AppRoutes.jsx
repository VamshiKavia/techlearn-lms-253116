import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute.jsx';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminOverview from '../pages/admin/AdminOverview';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminCourses from '../pages/admin/AdminCourses';
import AdminEnrollments from '../pages/admin/AdminEnrollments';

import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import InstructorOverview from '../pages/instructor/InstructorOverview';
import InstructorCourses from '../pages/instructor/InstructorCourses';
import InstructorCreateCourse from '../pages/instructor/InstructorCreateCourse';

import StudentDashboard from '../pages/student/StudentDashboard';
import StudentOverview from '../pages/student/StudentOverview';
import StudentCatalog from '../pages/student/StudentCatalog';
import StudentMyLearning from '../pages/student/StudentMyLearning';

// PUBLIC_INTERFACE
export default function AppRoutes() {
  /** Defines app routes with role-protected admin/instructor/student areas. */
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['Admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="overview" element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="enrollments" element={<AdminEnrollments />} />
      </Route>

      <Route
        path="/instructor"
        element={
          <ProtectedRoute roles={['Instructor', 'Admin']}>
            <InstructorDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="overview" element={<InstructorOverview />} />
        <Route path="courses" element={<InstructorCourses />} />
        <Route path="create-course" element={<InstructorCreateCourse />} />
      </Route>

      <Route
        path="/student"
        element={
          <ProtectedRoute roles={['Student', 'Admin']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="overview" element={<StudentOverview />} />
        <Route path="catalog" element={<StudentCatalog />} />
        <Route path="mylearning" element={<StudentMyLearning />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

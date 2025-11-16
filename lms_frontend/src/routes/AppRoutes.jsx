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
import InstructorOverview from '../pages/instructor/InstructorOverview';

import StudentDashboard from '../pages/student/StudentDashboard';
import StudentCourses from '../pages/student/StudentCourses';
import StudentOverview from '../pages/student/StudentOverview';
import StudentMyLearning from '../pages/student/StudentMyLearning';
import StudentCatalog from '../pages/student/StudentCatalog';
import CourseDetail from '../pages/student/CourseDetail';
import LessonPlayer from '../pages/student/LessonPlayer';
import QuizAttempt from '../pages/student/QuizAttempt';
import AssignmentSubmission from '../pages/student/AssignmentSubmission';

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
            { path: '/instructor', element: <InstructorOverview /> },
            { path: '/instructor/overview', element: <InstructorOverview /> },
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
            { path: '/student', element: <StudentOverview /> },
            { path: '/student/overview', element: <StudentOverview /> },
            { path: '/student/courses', element: <StudentCourses /> },
            { path: '/student/learning', element: <StudentMyLearning /> },
            { path: '/student/catalog', element: <StudentCatalog /> },
            { path: '/student/courses/:courseId', element: <CourseDetail /> },
            { path: '/student/courses/:courseId/lessons/:lessonId', element: <LessonPlayer /> },
            { path: '/student/courses/:courseId/quizzes/:quizId', element: <QuizAttempt /> },
            { path: '/student/courses/:courseId/assignments/:assignmentId', element: <AssignmentSubmission /> },
          ],
        },
      ],
    },
    { path: '*', element: <NotFound /> },
  ]);

  return <RouterProvider router={router} />;
}

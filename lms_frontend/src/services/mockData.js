 /**
  * Mock data helpers for various pages.
  * Keep these minimal and consistent with the Ocean Professional minimalist theme usage.
  */

 // PUBLIC_INTERFACE
 export const getMockStudentKPIs = () => ({
   enrolled: 5,
   inProgress: 3,
   certificates: 1,
 });

 // PUBLIC_INTERFACE
 export const getMockCatalog = () => [
   { id: 'c1', title: 'Intro to Testing', rating: 4.5 },
   { id: 'c2', title: 'React for Beginners', rating: 4.7 },
 ];

 // PUBLIC_INTERFACE
 export const getMockRecommendations = () => [
   { id: 'r1', title: 'Advanced React Patterns' },
   { id: 'r2', title: 'API Testing with Postman' },
 ];

 // PUBLIC_INTERFACE
 export const getMockInstructorCourses = () => [
   { id: 'c1', title: 'Intro to Testing', status: 'Published', enrollments: 32 },
   { id: 'c2', title: 'React for Beginners', status: 'Draft', enrollments: 0 },
   { id: 'c3', title: 'DevOps Fundamentals', status: 'Published', enrollments: 52 },
 ];

 // PUBLIC_INTERFACE
 export const getMockInstructorSubmissions = () => [
   {
     id: 's1',
     studentName: 'Alice Johnson',
     courseId: 'c1',
     courseTitle: 'Intro to Testing',
     lessonTitle: 'Assignment 1: Test Plan',
     status: 'Submitted',
   },
   {
     id: 's2',
     studentName: 'Bob Smith',
     courseId: 'c3',
     courseTitle: 'DevOps Fundamentals',
     lessonTitle: 'Assignment 2: CI Setup',
     status: 'Graded',
     grade: '88',
   },
   {
     id: 's3',
     studentName: 'Carol Jones',
     courseId: 'c1',
     courseTitle: 'Intro to Testing',
     lessonTitle: 'Assignment 2: Test Cases',
     status: 'Submitted',
   },
 ];

 // PUBLIC_INTERFACE
 // Student-facing mock courses with modules and lessons
 export const mockCourses = [
   {
     id: 'fs-react-node',
     title: 'Full-Stack React & Node.js',
     modules: [
       {
         id: 'm1',
         lessons: [
           { id: 'lesson-1', title: 'Intro & Setup', type: 'reading' },
           { id: 'lesson-2', title: 'Project Structure', type: 'reading' },
         ],
       },
       {
         id: 'm2',
         lessons: [
           { id: 'lesson-3', title: 'Hooks Deep Dive', type: 'reading' },
           { id: 'lesson-4', title: 'React Router', type: 'reading' },
         ],
       },
     ],
   },
   {
     id: 'devops-kubernetes',
     title: 'Kubernetes for DevOps',
     modules: [
       {
         id: 'm1',
         lessons: [
           { id: 'k1', title: 'K8s Basics', type: 'reading' },
           { id: 'k2', title: 'Deployments', type: 'reading' },
         ],
       },
     ],
   },
   {
     id: 'ds-python-ml',
     title: 'Python for Data Science & ML',
     modules: [
       {
         id: 'm1',
         lessons: [
           { id: 'p1', title: 'Pandas Basics', type: 'reading' },
           { id: 'p2', title: 'NumPy Intro', type: 'reading' },
         ],
       },
     ],
   },
 ];

 // PUBLIC_INTERFACE
 // Mock enrollments for a single student with completed lessons progress
 export const mockEnrollments = [
   {
     id: 'enr-1',
     studentId: 'student-1',
     courseId: 'fs-react-node',
     progressCompletedLessonIds: ['lesson-1'],
   },
   {
     id: 'enr-2',
     studentId: 'student-1',
     courseId: 'devops-kubernetes',
     progressCompletedLessonIds: [],
   },
   {
     id: 'enr-3',
     studentId: 'student-1',
     courseId: 'ds-python-ml',
     progressCompletedLessonIds: [],
   },
 ];

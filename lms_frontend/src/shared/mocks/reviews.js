//
// Mock reviews for the Student Reviews page (frontend-only)
// Each review has: id, courseTitle, reviewer, rating (0-5), comment, date (ISO string or readable date)
//
/**
 * PUBLIC_INTERFACE
 * reviews: Array of review objects to be rendered on the Reviews page.
 */
export const reviews = [
  {
    id: 'r1',
    courseTitle: 'Full Stack React & Node.js',
    reviewer: 'Ava Thompson',
    rating: 5,
    comment:
      'Great pacing and practical projects. I loved the section on routing and API design!',
    date: '2025-11-01',
  },
  {
    id: 'r2',
    courseTitle: 'Python for Data Science & ML',
    reviewer: 'Noah Martinez',
    rating: 5,
    comment:
      'Clear explanations and useful exercises. The pandas segment was super helpful.',
    date: '2025-10-26',
  },
  {
    id: 'r3',
    courseTitle: 'AWS Core Services',
    reviewer: 'Sophia Lee',
    rating: 4,
    comment:
      'Concise introduction to IAM and EC2. Would love more hands-on labs in future updates.',
    date: '2025-10-18',
  },
  {
    id: 'r4',
    courseTitle: 'Modern Web Testing with Cypress',
    reviewer: 'Liam Smith',
    rating: 5,
    comment:
      'Exactly what I needed to get started with end-to-end testing. Realistic examples.',
    date: '2025-10-12',
  },
  {
    id: 'r5',
    courseTitle: 'MLOps Foundations',
    reviewer: 'Emma Johnson',
    rating: 5,
    comment:
      'Solid coverage of the ML lifecycle. The deployment patterns section was a highlight.',
    date: '2025-09-30',
  },
  {
    id: 'r6',
    courseTitle: 'DevOps Fundamentals',
    reviewer: 'Oliver Davis',
    rating: 4,
    comment:
      'Great overview and practical tips. Would have liked a deeper dive into observability.',
    date: '2025-09-21',
  },
];

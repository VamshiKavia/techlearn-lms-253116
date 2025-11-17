//
// Mock data for Full Stack Development sections: Frontend, Backend, Database
// This mirrors the structure used on CategorySectionsPage for consistency.
//

/**
 * PUBLIC_INTERFACE
 * fullStackSections: Curriculum-style sections for the Full Stack Development page.
 * Structure:
 * {
 *   frontend: [{ title, rating?, progress?, lessons: [{title, duration, type, href?}] }],
 *   backend:  [{ ... }],
 *   database: [{ ... }]
 * }
 */
export const fullStackSections = {
  frontend: [
    {
      title: 'React Fundamentals',
      rating: 5,
      progress: 35,
      lessons: [
        { title: 'JSX & Components', duration: '12m', type: 'video' },
        { title: 'Props vs State', duration: '15m', type: 'video' },
        { title: 'React Router Basics', duration: '18m', type: 'video' },
      ],
    },
    {
      title: 'Modern UI Patterns',
      rating: 5,
      progress: 50,
      lessons: [
        { title: 'Composition over Inheritance', duration: '11m', type: 'video' },
        { title: 'Custom Hooks Primer', duration: '14m', type: 'video' },
        { title: 'State Management Options', duration: '16m', type: 'video' },
      ],
    },
    {
      title: 'Performance & Accessibility',
      rating: 5,
      progress: 20,
      lessons: [
        { title: 'Memoization & Suspense', duration: '10m', type: 'video' },
        { title: 'Accessibility Essentials', duration: '12m', type: 'video' },
        { title: 'Lighthouse & Web Vitals', duration: '9m', type: 'video' },
      ],
    },
  ],
  backend: [
    {
      title: 'Node.js & API Design',
      rating: 5,
      progress: 40,
      lessons: [
        { title: 'HTTP Basics & REST', duration: '13m', type: 'video' },
        { title: 'Routing & Controllers', duration: '16m', type: 'video' },
        { title: 'Error Handling Patterns', duration: '12m', type: 'video' },
      ],
    },
    {
      title: 'Auth & Security',
      rating: 5,
      progress: 25,
      lessons: [
        { title: 'JWT vs Session', duration: '14m', type: 'video' },
        { title: 'Protecting Routes', duration: '10m', type: 'video' },
        { title: 'OWASP Basics', duration: '15m', type: 'video' },
      ],
    },
    {
      title: 'Services & Integrations',
      rating: 5,
      progress: 30,
      lessons: [
        { title: 'External API Consumption', duration: '12m', type: 'video' },
        { title: 'Background Jobs', duration: '10m', type: 'video' },
        { title: 'File Uploads & CDN', duration: '9m', type: 'video' },
      ],
    },
  ],
  database: [
    {
      title: 'Relational Modeling',
      rating: 5,
      progress: 45,
      lessons: [
        { title: 'Tables, Keys, and Joins', duration: '12m', type: 'video' },
        { title: 'Normalization Basics', duration: '11m', type: 'video' },
        { title: 'Schema Versioning', duration: '9m', type: 'video' },
      ],
    },
    {
      title: 'Querying & Performance',
      rating: 5,
      progress: 35,
      lessons: [
        { title: 'Indexes & EXPLAIN', duration: '15m', type: 'video' },
        { title: 'Transactions & Isolation', duration: '14m', type: 'video' },
        { title: 'Caching Strategies', duration: '10m', type: 'video' },
      ],
    },
    {
      title: 'Practical Operations',
      rating: 5,
      progress: 20,
      lessons: [
        { title: 'Backups & Restores', duration: '10m', type: 'video' },
        { title: 'Migrations in CI/CD', duration: '12m', type: 'video' },
        { title: 'Observability & Alerts', duration: '11m', type: 'video' },
      ],
    },
  ],
};

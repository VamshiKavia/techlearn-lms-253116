export const mockCourses = [
  // Full-Stack
  {
    id: 'fs-react-node',
    title: 'Full-Stack React & Node.js',
    category: 'Full-Stack',
    level: 'Intermediate',
    rating: 4.7,
    students: 18420,
    progress: 0,
    thumbnail: '/images/react-node.png',
    modules: [
      {
        id: 'm1',
        title: 'Foundations',
        lessons: [
          { id: 'l1', title: 'Intro & Setup', type: 'video', duration: '08:21', url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4' },
          { id: 'l2', title: 'Project Structure', type: 'reading' },
        ],
        resources: [{ title: 'Starter Repo', link: 'https://github.com/' }],
      },
      {
        id: 'm2',
        title: 'Frontend with React',
        lessons: [
          { id: 'l3', title: 'Hooks Deep Dive', type: 'video', duration: '12:05', url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4' },
        ],
        resources: [{ title: 'React Docs', link: 'https://react.dev' }],
      },
    ],
  },
  {
    id: 'fs-next-prisma',
    title: 'Next.js + Prisma + Postgres',
    category: 'Full-Stack',
    level: 'Advanced',
    rating: 4.6,
    students: 9212,
    progress: 0,
    thumbnail: '/images/next-prisma.png',
    modules: [
      { id: 'm1', title: 'Next.js Routing', lessons: [{ id: 'l1', title: 'App Router', type: 'video', url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4' }] },
    ],
  },

  // Data Science
  {
    id: 'ds-python-ml',
    title: 'Python for Data Science & ML',
    category: 'Data Science',
    level: 'Beginner',
    rating: 4.8,
    students: 25210,
    progress: 0,
    thumbnail: '/images/ds-python.png',
    modules: [
      { id: 'm1', title: 'NumPy & Pandas', lessons: [{ id: 'l1', title: 'Pandas Basics', type: 'video', url: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4' }] },
    ],
    resources: [{ title: 'Kaggle', link: 'https://kaggle.com' }],
  },
  {
    id: 'ds-mlops',
    title: 'MLOps Foundations',
    category: 'Data Science',
    level: 'Intermediate',
    rating: 4.5,
    students: 7111,
    progress: 0,
    thumbnail: '/images/mlops.png',
  },

  // Cloud
  {
    id: 'cloud-aws-solutions',
    title: 'AWS Solutions Architect',
    category: 'Cloud',
    level: 'Intermediate',
    rating: 4.6,
    students: 18900,
    progress: 0,
    thumbnail: '/images/aws.png',
  },
  {
    id: 'cloud-gcp-fundamentals',
    title: 'GCP Fundamentals',
    category: 'Cloud',
    level: 'Beginner',
    rating: 4.4,
    students: 8400,
    progress: 0,
    thumbnail: '/images/gcp.png',
  },

  // DevOps
  {
    id: 'devops-kubernetes',
    title: 'Kubernetes for DevOps',
    category: 'DevOps',
    level: 'Intermediate',
    rating: 4.7,
    students: 14700,
    progress: 0,
    thumbnail: '/images/k8s.png',
  },
  {
    id: 'devops-ci-cd',
    title: 'CI/CD with GitHub Actions',
    category: 'DevOps',
    level: 'Beginner',
    rating: 4.5,
    students: 9100,
    progress: 0,
    thumbnail: '/images/cicd.png',
  },

  // Software Testing
  {
    id: 'test-cypress',
    title: 'Modern Web Testing with Cypress',
    category: 'Software Testing',
    level: 'Intermediate',
    rating: 4.6,
    students: 5600,
    progress: 0,
    thumbnail: '/images/cypress.png',
  },
  {
    id: 'test-playwright',
    title: 'Playwright End-to-End Testing',
    category: 'Software Testing',
    level: 'Advanced',
    rating: 4.5,
    students: 4800,
    progress: 0,
    thumbnail: '/images/playwright.png',
  },

  // AI
  {
    id: 'ai-llms-foundations',
    title: 'LLMs Foundations & Prompting',
    category: 'AI',
    level: 'Intermediate',
    rating: 4.7,
    students: 13300,
    progress: 0,
    thumbnail: '/images/llm.png',
  },
  {
    id: 'ai-computer-vision',
    title: 'Computer Vision with PyTorch',
    category: 'AI',
    level: 'Intermediate',
    rating: 4.4,
    students: 7200,
    progress: 0,
    thumbnail: '/images/cv.png',
  },
];

export const sampleBreadcrumbs = (courseTitle) => ([
  { label: 'Catalog', to: '/student/catalog' },
  { label: courseTitle || 'Course', to: '#' },
]);

export const filterCoursesByCategory = (category) =>
  mockCourses.filter(c => c.category === category);

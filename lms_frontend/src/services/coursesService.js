import { z } from 'zod';

// Core schemas
const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  instructorId: z.string().optional(),
  category: z
    .enum(['Full-Stack Development', 'Data Science', 'Software Testing', 'Cloud', 'DevOps', 'AI'])
    .optional(),
  rating: z.number().optional(),
  lessonsCount: z.number().optional(),
});

const listSchema = z.object({ items: z.array(courseSchema) });

const moduleSchema = z.object({
  id: z.string(),
  title: z.string(),
  lessons: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      type: z.enum(['video', 'reading', 'quiz', 'assignment']),
      durationMin: z.number().optional(),
    })
  ),
});

const courseDetailSchema = courseSchema.extend({
  modules: z.array(moduleSchema),
  resources: z.array(z.object({ id: z.string(), title: z.string(), url: z.string().url().optional() })),
});

const quizSchema = z.object({
  id: z.string(),
  title: z.string(),
  questions: z.array(
    z.object({
      id: z.string(),
      prompt: z.string(),
      options: z.array(z.string()),
      correctIndex: z.number(), // Only used in mock, not shown to user
    })
  ),
});

const assignmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  instructions: z.string(),
  dueAt: z.string(),
});

// PUBLIC_INTERFACE
export function createCoursesService(api) {
  /** Course service with mock implementations for catalog and course content. */
  const mockCatalog = [
    {
      id: 'c-fs-1',
      title: 'Full-Stack Development Bootcamp',
      description: 'Build modern web apps end-to-end with React & Node.js.',
      category: 'Full-Stack Development',
      rating: 4.7,
      lessonsCount: 62,
    },
    {
      id: 'c-ds-1',
      title: 'Data Science with Python',
      description: 'Pandas, NumPy, visualization, and introductory ML.',
      category: 'Data Science',
      rating: 4.6,
      lessonsCount: 48,
    },
    {
      id: 'c-st-1',
      title: 'Software Testing Foundations',
      description: 'Unit, integration, and E2E testing strategies.',
      category: 'Software Testing',
      rating: 4.4,
      lessonsCount: 30,
    },
    {
      id: 'c-cloud-1',
      title: 'Cloud Fundamentals on AWS',
      description: 'Core services, IAM, and deployment basics.',
      category: 'Cloud',
      rating: 4.5,
      lessonsCount: 35,
    },
    {
      id: 'c-devops-1',
      title: 'DevOps with Docker & Kubernetes',
      description: 'CI/CD fundamentals and container orchestration.',
      category: 'DevOps',
      rating: 4.8,
      lessonsCount: 40,
    },
    {
      id: 'c-ai-1',
      title: 'Intro to AI & ML',
      description: 'AI concepts, supervised/unsupervised learning.',
      category: 'AI',
      rating: 4.3,
      lessonsCount: 28,
    },
  ];

  const mockDetails = {
    'c-fs-1': {
      id: 'c-fs-1',
      title: 'Full-Stack Development Bootcamp',
      description:
        'A comprehensive track covering frontend with React and backend with Node.js/Express, including databases.',
      category: 'Full-Stack Development',
      rating: 4.7,
      modules: [
        {
          id: 'm1',
          title: 'Frontend Basics',
          lessons: [
            { id: 'l1', title: 'React Components 101', type: 'video', durationMin: 20 },
            { id: 'l2', title: 'State & Props', type: 'reading', durationMin: 10 },
            { id: 'q1', title: 'Quiz: React Fundamentals', type: 'quiz' },
          ],
        },
        {
          id: 'm2',
          title: 'Backend with Node.js',
          lessons: [
            { id: 'l3', title: 'Express Basics', type: 'video', durationMin: 18 },
            { id: 'a1', title: 'Assignment: Build an API', type: 'assignment' },
          ],
        },
      ],
      resources: [
        { id: 'r1', title: 'Cheat Sheet: ES6+', url: 'https://developer.mozilla.org/' },
        { id: 'r2', title: 'REST API Design Best Practices', url: 'https://restfulapi.net/' },
      ],
    },
    'c-ds-1': {
      id: 'c-ds-1',
      title: 'Data Science with Python',
      description:
        'Learn data wrangling, analysis, and visualization with Python libraries and an intro to ML.',
      category: 'Data Science',
      rating: 4.6,
      modules: [
        {
          id: 'm1',
          title: 'Python for Data',
          lessons: [
            { id: 'l1', title: 'Pandas DataFrames', type: 'video', durationMin: 22 },
            { id: 'l2', title: 'NumPy Arrays', type: 'reading', durationMin: 12 },
            { id: 'q1', title: 'Quiz: Python Basics', type: 'quiz' },
          ],
        },
      ],
      resources: [{ id: 'r1', title: 'Pandas Docs', url: 'https://pandas.pydata.org/' }],
    },
  };

  const mockQuizzes = {
    'c-fs-1:q1': {
      id: 'q1',
      title: 'Quiz: React Fundamentals',
      questions: [
        {
          id: 'q-1',
          prompt: 'Which hook is used for state in functional components?',
          options: ['useData', 'useState', 'useStore', 'useValue'],
          correctIndex: 1,
        },
        {
          id: 'q-2',
          prompt: 'Props are:',
          options: ['Mutable', 'Immutable', 'Methods', 'Global variables'],
          correctIndex: 1,
        },
      ],
    },
    'c-ds-1:q1': {
      id: 'q1',
      title: 'Quiz: Python Basics',
      questions: [
        {
          id: 'q-1',
          prompt: 'Which library is primarily used for tabular data?',
          options: ['NumPy', 'Pandas', 'Matplotlib', 'Seaborn'],
          correctIndex: 1,
        },
      ],
    },
  };

  const mockAssignments = {
    'c-fs-1:a1': {
      id: 'a1',
      title: 'Assignment: Build an API',
      instructions:
        'Create a simple REST API using Express with routes for GET/POST/PUT/DELETE on a resource of your choice.',
      dueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
  };

  return {
    /**
     * PUBLIC_INTERFACE
     * List catalog with optional filters and pagination.
     */
    async list({ category, page = 1, pageSize = 6 } = {}) {
      // TODO: GET /courses
      const filtered = category ? mockCatalog.filter((c) => c.category === category) : mockCatalog;
      const start = (page - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize);
      return { items, total: filtered.length, page, pageSize };
    },

    /**
     * PUBLIC_INTERFACE
     * Get detailed course info including modules/lessons/resources.
     */
    async get(id) {
      // TODO: GET /courses/:id
      const found = mockDetails[id] || {
        id,
        title: 'Placeholder Course',
        description: 'Course details coming soon.',
        modules: [],
        resources: [],
      };
      return courseDetailSchema.parse(found);
    },

    /**
     * PUBLIC_INTERFACE
     * Get quiz content for a given course and quiz id.
     */
    async getQuiz(courseId, quizId) {
      // TODO: GET /courses/:id/quizzes/:quizId
      const key = `${courseId}:${quizId}`;
      const quiz = mockQuizzes[key];
      if (!quiz) throw new Error('Quiz not found');
      // Return without correctIndex (hide answers in UI data)
      return quizSchema
        .omit({ questions: true })
        .extend({
          questions: z.array(z.object({ id: z.string(), prompt: z.string(), options: z.array(z.string()) })),
        })
        .parse({
          ...quiz,
          questions: quiz.questions.map((q) => ({ id: q.id, prompt: q.prompt, options: q.options })),
        });
    },

    /**
     * PUBLIC_INTERFACE
     * Submit quiz answers and return mock evaluation.
     */
    async submitQuiz(courseId, quizId, answers) {
      // TODO: POST /courses/:id/quizzes/:quizId/attempts
      const key = `${courseId}:${quizId}`;
      const quiz = mockQuizzes[key];
      if (!quiz) throw new Error('Quiz not found');
      const correct = quiz.questions.reduce((acc, q, idx) => acc + (answers[idx] === q.correctIndex ? 1 : 0), 0);
      const score = Math.round((correct / quiz.questions.length) * 100);
      return { score, correct, total: quiz.questions.length, passed: score >= 60 };
    },

    /**
     * PUBLIC_INTERFACE
     * Get assignment details for a course.
     */
    async getAssignment(courseId, assignmentId) {
      // TODO: GET /courses/:id/assignments/:assignmentId
      const key = `${courseId}:${assignmentId}`;
      const a = mockAssignments[key];
      if (!a) throw new Error('Assignment not found');
      return assignmentSchema.parse(a);
    },

    /**
     * PUBLIC_INTERFACE
     * Submit assignment text or URL (mock).
     */
    async submitAssignment(courseId, assignmentId, payload) {
      // TODO: POST /courses/:id/assignments/:assignmentId/submissions
      // Return a simple acknowledgment
      return {
        id: `sub_${Date.now()}`,
        courseId,
        assignmentId,
        receivedAt: new Date().toISOString(),
        status: 'submitted',
        preview: (payload?.text || payload?.url || '').slice(0, 80),
      };
    },

    /**
     * PUBLIC_INTERFACE
     * Create a new course (mock).
     */
    async create(payload) {
      // TODO: POST /courses
      return courseSchema.parse({
        id: `c_${Date.now()}`,
        title: payload.title ?? 'Untitled',
        description: payload.description ?? '',
        category: payload.category ?? 'Full-Stack Development',
        rating: 4.5,
        lessonsCount: 0,
      });
    },
  };
}

export { courseSchema };

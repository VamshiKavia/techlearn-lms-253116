import { z } from 'zod';

const answerSchema = z.object({
  id: z.string(),
  body: z.string(),
  author: z.string().optional(),
  createdAt: z.string(),
});

const questionSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  courseTitle: z.string(),
  title: z.string(),
  body: z.string(),
  author: z.string().optional(),
  createdAt: z.string(),
  answers: z.array(answerSchema).optional(),
});

// PUBLIC_INTERFACE
export function createQnaService(_api) {
  /**
   * Q&A service with mock implementations.
   */
  const seed = [
    {
      id: 'q1',
      courseId: 'c-fs-1',
      courseTitle: 'Full-Stack Development Bootcamp',
      title: 'How to manage state across components?',
      body: 'Should I use Context or a library like Redux for mid-size apps?',
      author: 'student4@example.com',
      createdAt: new Date(Date.now() - 3600 * 1000 * 8).toISOString(),
      answers: [
        {
          id: 'a1',
          body: 'Start with Context for simple cases; consider Redux or Zustand when complexity grows.',
          author: 'instructor@example.com',
          createdAt: new Date(Date.now() - 3600 * 1000 * 6).toISOString(),
        },
      ],
    },
    {
      id: 'q2',
      courseId: 'c-ds-1',
      courseTitle: 'Data Science with Python',
      title: 'Vectorized operations vs loops?',
      body: 'When is it better to use vectorized ops in NumPy?',
      author: 'student5@example.com',
      createdAt: new Date(Date.now() - 3600 * 1000 * 30).toISOString(),
      answers: [],
    },
  ];

  let items = [...seed];

  return {
    /**
     * PUBLIC_INTERFACE
     * List questions with optional course filter and pagination.
     */
    async list({ page = 1, pageSize = 5, courseId } = {}) {
      let filtered = items;
      if (courseId) filtered = filtered.filter((q) => q.courseId === courseId);
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const start = (page - 1) * pageSize;
      const pageItems = filtered.slice(start, start + pageSize).map((q) => questionSchema.parse(q));
      return { items: pageItems, total: filtered.length, page, pageSize };
    },

    /**
     * PUBLIC_INTERFACE
     * Ask a new question (mock).
     */
    async ask(payload) {
      const courseTitles = {
        'c-fs-1': 'Full-Stack Development Bootcamp',
        'c-ds-1': 'Data Science with Python',
        'c-devops-1': 'DevOps with Docker & Kubernetes',
        'c-cloud-1': 'Cloud Fundamentals on AWS',
        'c-st-1': 'Software Testing Foundations',
        'c-ai-1': 'Intro to AI & ML',
      };
      const rec = questionSchema.parse({
        id: `q_${Date.now()}`,
        courseId: payload.courseId || 'unknown',
        courseTitle: courseTitles[payload.courseId] || 'Course',
        title: payload.title || '',
        body: payload.body || '',
        author: 'you',
        createdAt: new Date().toISOString(),
        answers: [],
      });
      items = [rec, ...items];
      return rec;
    },
  };
}

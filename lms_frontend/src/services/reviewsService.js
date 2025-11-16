import { z } from 'zod';

const reviewSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  courseTitle: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  author: z.string().optional(),
  createdAt: z.string(),
});

// PUBLIC_INTERFACE
export function createReviewsService(_api) {
  /**
   * Reviews service with mock implementations.
   * All methods return promises and do not perform HTTP requests.
   */
  const mock = [
    {
      id: 'rev1',
      courseId: 'c-fs-1',
      courseTitle: 'Full-Stack Development Bootcamp',
      rating: 5,
      comment: 'Excellent structure and explanations.',
      author: 'student1@example.com',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    },
    {
      id: 'rev2',
      courseId: 'c-ds-1',
      courseTitle: 'Data Science with Python',
      rating: 4,
      comment: 'Great content, could use more exercises.',
      author: 'student2@example.com',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 'rev3',
      courseId: 'c-devops-1',
      courseTitle: 'DevOps with Docker & Kubernetes',
      rating: 5,
      comment: 'Hands-on and practical.',
      author: 'student3@example.com',
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
  ];

  let items = [...mock];

  return {
    /**
     * PUBLIC_INTERFACE
     * List reviews with optional course filter and pagination.
     */
    async list({ page = 1, pageSize = 5, courseId } = {}) {
      let filtered = items;
      if (courseId) {
        filtered = filtered.filter((r) => r.courseId === courseId);
      }
      // sort by created desc
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const start = (page - 1) * pageSize;
      const pageItems = filtered.slice(start, start + pageSize).map((r) => reviewSchema.parse(r));
      return { items: pageItems, total: filtered.length, page, pageSize };
    },

    /**
     * PUBLIC_INTERFACE
     * Add a new review to mock store.
     */
    async add(payload) {
      const courseTitles = {
        'c-fs-1': 'Full-Stack Development Bootcamp',
        'c-ds-1': 'Data Science with Python',
        'c-devops-1': 'DevOps with Docker & Kubernetes',
        'c-cloud-1': 'Cloud Fundamentals on AWS',
        'c-st-1': 'Software Testing Foundations',
        'c-ai-1': 'Intro to AI & ML',
      };
      const rec = reviewSchema.parse({
        id: `rev_${Date.now()}`,
        courseId: payload.courseId || 'unknown',
        courseTitle: courseTitles[payload.courseId] || 'Course',
        rating: Number(payload.rating) || 0,
        comment: payload.comment || '',
        author: 'you',
        createdAt: new Date().toISOString(),
      });
      items = [rec, ...items];
      return rec;
    },
  };
}

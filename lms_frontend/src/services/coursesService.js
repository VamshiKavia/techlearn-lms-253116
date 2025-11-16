import { z } from 'zod';

const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  instructorId: z.string().optional(),
});

const listSchema = z.object({ items: z.array(courseSchema) });

// PUBLIC_INTERFACE
export function createCoursesService(api) {
  /** Course service with placeholder implementations. */
  return {
    async list() {
      // TODO: GET /courses
      return listSchema.parse({
        items: [
          { id: 'c1', title: 'Full-Stack Development Bootcamp' },
          { id: 'c2', title: 'Data Science with Python' },
        ],
      });
    },
    async get(id) {
      // TODO: GET /courses/:id
      return courseSchema.parse({
        id,
        title: 'Placeholder Course',
        description: 'Course details coming soon.',
      });
    },
    async create(payload) {
      // TODO: POST /courses
      return courseSchema.parse({
        id: `c_${Date.now()}`,
        title: payload.title ?? 'Untitled',
        description: payload.description ?? '',
      });
    },
  };
}

export { courseSchema };

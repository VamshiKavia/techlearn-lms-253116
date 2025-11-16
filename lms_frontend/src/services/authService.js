import { z } from 'zod';

// Basic shapes for runtime validation
const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.enum(['admin', 'instructor', 'student']),
});

const authResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string().optional(),
  user: userSchema,
});

// PUBLIC_INTERFACE
export function createAuthService(api) {
  /** Auth service wrapping login, signup, me endpoints. */
  return {
    async login(credentials) {
      // TODO: Replace with backend integration: POST /auth/login
      // const { data } = await api.post('/auth/login', credentials);
      // return authResponseSchema.parse(data);
      // Mock response to enable UI flow
      const role = ['admin', 'instructor', 'student'].includes(credentials.role)
        ? credentials.role
        : 'student';
      const mock = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh',
        user: { email: credentials.email, role },
      };
      return authResponseSchema.parse(mock);
    },
    async signup(input) {
      // TODO: Replace with real POST /auth/signup
      const role = ['admin', 'instructor', 'student'].includes(input.role)
        ? input.role
        : 'student';
      const mock = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh',
        user: { email: input.email, role },
      };
      return authResponseSchema.parse(mock);
    },
    async me() {
      // TODO: Replace with GET /auth/me
      throw new Error('Not implemented');
    },
    // PUBLIC_INTERFACE
    userSchema,
  };
}

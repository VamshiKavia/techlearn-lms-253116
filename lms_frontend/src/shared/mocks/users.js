//
// Local sample users for frontend-only authentication.
// DO NOT include any sensitive data. This is purely for demo purposes.
//
/**
 * PUBLIC_INTERFACE
 * users: In-memory list of mock users for client-only login.
 * Each user: { id, name, email, password, role }
 */
export const users = [
  { id: 'u1', name: 'Student One', email: 'student1@example.com', password: 'password123', role: 'student' },
  { id: 'u2', name: 'Student Two', email: 'student2@example.com', password: 'password123', role: 'student' },
  { id: 'u3', name: 'Instructor One', email: 'instructor@example.com', password: 'teach123', role: 'instructor' },
];

/**
 * PUBLIC_INTERFACE
 * findUserByCredentials
 * Basic client-side match of email/password against local users list.
 * - Trims email; compares case-insensitive for email, case-sensitive for password.
 * - Returns a safe user object without password on success, or null if not found.
 */
export function findUserByCredentials(email, password) {
  const e = (email || '').trim().toLowerCase();
  const user = users.find(u => u.email.toLowerCase() === e && u.password === password);
  if (!user) return null;
  // strip password before returning
  const { password: _p, ...safe } = user;
  return safe;
}

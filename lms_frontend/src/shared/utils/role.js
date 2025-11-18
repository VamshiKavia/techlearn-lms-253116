//
// PUBLIC_INTERFACE
// getSelectedRole
// Returns the last selected role from localStorage ('admin' | 'instructor' | 'student' | '').
//
// PUBLIC_INTERFACE
export function getSelectedRole() {
  try {
    const r = localStorage.getItem('techlearn.role') || '';
    if (['admin', 'instructor', 'student'].includes(r)) return r;
    return '';
  } catch {
    return '';
  }
}

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Login
 * Email/password login using Supabase. On success, redirects to requested path
 * or to the Student dashboard (/student/overview).
 *
 * Enhancements:
 * - Adds a required "Role" selector (Admin, Instructor, Student).
 * - Validates role before submission.
 * - Persists selected role to localStorage as 'techlearn.role'.
 * - Optionally redirects to role-appropriate dashboard when feature flag REACT_APP_FEATURE_FLAGS includes 'roleBasedRedirect'.
 */
export function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, initializing, signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(() => {
    // Restore last chosen role from localStorage, if any
    try {
      const r = localStorage.getItem('techlearn.role');
      if (r && ['admin', 'instructor', 'student'].includes(r)) return r;
    } catch {
      // ignore
    }
    return '';
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // prefer student dashboard as landing page; allow deep-link redirect param
  const redirectTo = params.get('redirect') || '/student/overview';

  // if already authenticated, redirect out of login page
  useEffect(() => {
    if (!initializing && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, initializing, navigate, redirectTo]);

  const validate = () => {
    const e = email.trim();
    if (!e) return 'Email is required';
    // Simple email pattern for client-side validation only
    // eslint-disable-next-line no-control-regex
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(e)) return 'Please enter a valid email address';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!role) return 'Role is required';
    if (!['admin', 'instructor', 'student'].includes(role)) return 'Please select a valid role';
    return '';
  };

  // Choose a post-login path by role when feature flag is present
  const resolveRoleRedirect = () => {
    const flags = (process.env.REACT_APP_FEATURE_FLAGS || '').toLowerCase();
    const enableRoleRedirect = flags.includes('rolebasedredirect');
    if (!enableRoleRedirect) return redirectTo;

    if (role === 'admin') return '/admin';
    if (role === 'instructor') return '/student/overview'; // placeholder until /instructor routes exist
    return '/student/overview';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSubmitting(true);
    try {
      // Persist chosen role locally so other parts of the app can read it (e.g., AdminProtectedRoute in future).
      try {
        localStorage.setItem('techlearn.role', role);
      } catch {
        // ignore storage failures
      }

      // If a backend or Supabase custom claim is expected, this is where you'd include it.
      // For Supabase email/password we still authenticate the user normally:
      await signIn(email, password);

      const target = resolveRoleRedirect();
      navigate(target, { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const Label = ({ children }) => (
    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{children}</span>
  );

  const Input = (props) => (
    <input
      {...props}
      style={{
        height: 40,
        padding: '8px 12px',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        ...props.style,
      }}
    />
  );

  const Select = (props) => (
    <select
      {...props}
      style={{
        height: 40,
        padding: '8px 12px',
        border: '1px solid var(--border-subtle)',
        borderRadius: 8,
        background: 'white',
        ...props.style,
      }}
    />
  );

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: 'var(--bg-subtle)' }}>
      <div className="card" style={{ width: 'min(420px, 92vw)', padding: 20, borderRadius: 12 }}>
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.2, color: 'var(--text-primary)' }}>TechLearn</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Welcome back</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Sign in with your email, password, and role to continue.
          </div>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#7F1D1D',
              padding: '8px 10px',
              borderRadius: 8,
              marginBottom: 12
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <Label>Email</Label>
              <Input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-required="true"
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <Label>Password</Label>
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                aria-required="true"
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <Label>Role</Label>
              <Select
                aria-label="Select role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-required="true"
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
                <option value="student">Student</option>
              </Select>
              {!role && (
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Please select your role.
                </span>
              )}
            </label>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              style={{ height: 40, marginTop: 4 }}
              aria-busy={submitting ? 'true' : 'false'}
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>

        <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
          Use your registered email and password. Contact support if you need access.
        </div>
      </div>
    </div>
  );
}

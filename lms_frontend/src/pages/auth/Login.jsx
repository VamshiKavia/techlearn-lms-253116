import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Login
 * Email/password login using Supabase. On success, redirects to requested path
 * or to a role-based destination using Supabase user_metadata.role as source of truth (falls back to local selection).
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

  const redirectTo = params.get('redirect') || '/student/overview';

  // Determine role from metadata if present on current user; fallback to local storage selection.
  const effectiveRole = (() => {
    const meta =
      user?.user_metadata?.role ||
      user?.app_metadata?.role ||
      user?.identities?.[0]?.identity_data?.role ||
      '';
    if (meta && ['admin', 'instructor', 'student'].includes(String(meta))) return String(meta);
    return role || '';
  })();

  // If already authenticated, redirect based on metadata role then fallback to redirectTo
  useEffect(() => {
    if (!initializing && user) {
      if (effectiveRole === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }
      if (effectiveRole === 'student') {
        // Note: retain original path "/dashboad" used previously in this codebase
        navigate('/dashboad', { replace: true });
        return;
      }
      navigate(redirectTo || '/student/overview', { replace: true });
    }
  }, [user, initializing, navigate, redirectTo, effectiveRole]);

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

  const resolveRoleRedirect = (r) => {
    if (r === 'admin') return '/admin';
    if (r === 'student') return '/dashboad';
    return redirectTo || '/student/overview';
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
      // Attempt sign-in and write selected role to Supabase user_metadata
      await signIn(email, password, role);

      // After sign-in, use metadata role if available; fallback to selected role
      let metaRole = '';
      try {
        const u = (await (async () => user)()) || null;
        // The local 'user' might not update synchronously; prefer the chosen role for immediate redirect.
        metaRole =
          u?.user_metadata?.role ||
          u?.app_metadata?.role ||
          u?.identities?.[0]?.identity_data?.role ||
          '';
      } catch {
        // ignore
      }
      const target = resolveRoleRedirect(
        ['admin', 'instructor', 'student'].includes(String(metaRole)) ? String(metaRole) : role
      );
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

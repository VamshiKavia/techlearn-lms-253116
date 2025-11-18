import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Login
 * Email/password login using Supabase. On success, redirects to requested path
 * or to the Student dashboard (/student/overview).
 */
export function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, initializing, signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    return '';
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
      await signIn(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: 'var(--bg-subtle)' }}>
      <div className="card" style={{ width: 'min(420px, 92vw)', padding: 20, borderRadius: 12 }}>
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.2, color: 'var(--text-primary)' }}>TechLearn</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Welcome back</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Sign in to continue to your student dashboard.
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
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>Email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  height: 40,
                  padding: '8px 12px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8
                }}
                aria-required="true"
              />
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={{
                  height: 40,
                  padding: '8px 12px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8
                }}
                aria-required="true"
              />
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

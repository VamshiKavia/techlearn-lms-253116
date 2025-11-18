import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import { getSupabaseClient } from '../../core/clients/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * LoginRegister
 * Unified authentication screen supporting:
 * - Email/password Sign In
 * - Email/password Sign Up
 * - Magic Link (OTP) sign-in via email
 *
 * Notes:
 * - Redirect behavior: uses ?redirect=... or defaults to /student/overview
 * - Uses environment variable REACT_APP_SITE_URL for magic link redirect; falls back to window.location.origin
 * - Make sure to configure Supabase Dashboard -> Auth -> URL Configuration:
 *   • Site URL: your production URL (e.g., https://app.example.com)
 *   • Redirect URLs: include any callback URLs you need
 */
export function LoginRegister() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, initializing } = useAuth();
  const supabase = useMemo(() => getSupabaseClient(), []);

  const [activeTab, setActiveTab] = useState('signin'); // signin | signup | magic
  const redirectTo = params.get('redirect') || '/student/overview';

  // Shared fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect away if already authenticated
  useEffect(() => {
    if (!initializing && user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, initializing, navigate, redirectTo]);

  const validateEmail = (val) => {
    const e = (val || '').trim();
    // eslint-disable-next-line no-control-regex
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!e) return 'Email is required';
    if (!emailRe.test(e)) return 'Please enter a valid email address';
    return '';
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const ev = validateEmail(email);
    if (ev) return setError(ev);
    if (!password) return setError('Password is required');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw new Error(err.message || 'Unable to sign in');
      if (data?.user) {
        navigate(redirectTo, { replace: true });
      }
    } catch (ex) {
      setError(ex?.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const ev = validateEmail(email);
    if (ev) return setError(ev);
    if (!password) return setError('Password is required');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (confirm !== password) return setError('Passwords do not match');
    setLoading(true);
    try {
      const emailRedirectTo = process.env.REACT_APP_SITE_URL || window.location.origin;
      if (!process.env.REACT_APP_SITE_URL) {
        // eslint-disable-next-line no-console
        console.warn('[Auth] REACT_APP_SITE_URL is not set; using window.location.origin for email redirects:', emailRedirectTo);
      }
      const { data, error: err } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
        },
      });
      if (err) throw new Error(err.message || 'Unable to sign up');
      if (data?.user) {
        setInfo('Check your inbox to confirm your email. After confirmation, you can sign in.');
        setActiveTab('signin');
      }
    } catch (ex) {
      setError(ex?.message || 'Sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMagic = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const ev = validateEmail(email);
    if (ev) return setError(ev);
    setLoading(true);
    try {
      const emailRedirectTo = process.env.REACT_APP_SITE_URL || window.location.origin;
      if (!process.env.REACT_APP_SITE_URL) {
        // eslint-disable-next-line no-console
        console.warn('[Auth] REACT_APP_SITE_URL is not set; using window.location.origin for email redirects:', emailRedirectTo);
      }
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo,
        },
      });
      if (err) throw new Error(err.message || 'Unable to send magic link');
      setInfo('Magic link sent. Please check your email to continue.');
    } catch (ex) {
      setError(ex?.message || 'Magic link request failed');
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label }) => {
    const isActive = activeTab === id;
    return (
      <button
        className={`tab ${isActive ? 'tab--active' : ''}`}
        onClick={() => {
          setError('');
          setInfo('');
          setActiveTab(id);
        }}
        aria-selected={isActive ? 'true' : 'false'}
        role="tab"
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: 'var(--bg-subtle)' }}>
      <div className="card" style={{ width: 'min(520px, 94vw)', padding: 20, borderRadius: 12 }}>
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: -0.2, color: 'var(--text-primary)' }}>TechLearn</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Access your account</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Sign in, create an account, or use a magic link to continue to your dashboard.
          </div>
        </div>

        <div className="tabs" role="tablist" aria-label="Authentication methods">
          <TabButton id="signin" label="Sign In" />
          <TabButton id="signup" label="Sign Up" />
          <TabButton id="magic" label="Magic Link" />
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
              marginTop: 12,
            }}
          >
            {error}
          </div>
        )}

        {info && (
          <div
            role="status"
            style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              color: '#1E3A8A',
              padding: '8px 10px',
              borderRadius: 8,
              marginTop: 12,
            }}
          >
            {info}
          </div>
        )}

        {/* Sign In */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} noValidate style={{ marginTop: 12 }}>
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
                    borderRadius: 8,
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
                    borderRadius: 8,
                  }}
                  aria-required="true"
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ height: 40, marginTop: 4 }}
                aria-busy={loading ? 'true' : 'false'}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </form>
        )}

        {/* Sign Up */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} noValidate style={{ marginTop: 12 }}>
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
                    borderRadius: 8,
                  }}
                  aria-required="true"
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>Password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  style={{
                    height: 40,
                    padding: '8px 12px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                  }}
                  aria-required="true"
                />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>Confirm Password</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your password"
                  style={{
                    height: 40,
                    padding: '8px 12px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                  }}
                  aria-required="true"
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ height: 40, marginTop: 4 }}
                aria-busy={loading ? 'true' : 'false'}
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>

              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                By creating an account, you agree to our terms and privacy policy.
              </div>
            </div>
          </form>
        )}

        {/* Magic Link */}
        {activeTab === 'magic' && (
          <form onSubmit={handleMagic} noValidate style={{ marginTop: 12 }}>
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
                    borderRadius: 8,
                  }}
                  aria-required="true"
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ height: 40, marginTop: 4 }}
                aria-busy={loading ? 'true' : 'false'}
              >
                {loading ? 'Sending link…' : 'Send magic link'}
              </button>

              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                We will email you a link that lets you sign in instantly.
              </div>
            </div>
          </form>
        )}

        <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
          Admin note: Configure Auth redirect URLs in Supabase Dashboard → Auth → URL Configuration. Set the Site URL
          and add any additional redirect URLs as needed for your environment.
        </div>

        <div style={{ marginTop: 12, fontSize: 12 }}>
          <Link to="/auth">Switch methods</Link> • <Link to="/login">Legacy sign-in</Link>
        </div>
      </div>
    </div>
  );
}

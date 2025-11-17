import React, { useState } from 'react';
// Always import from the JS shim to ensure CRA env resolution in all bundlers
import { supabase } from '../lib/supabaseClient.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        let message = error.message || 'Login failed. Please check your credentials.';
        if (error?.code === 'email_not_confirmed' || /email not confirmed/i.test(message)) {
          message += ' Please confirm your email address, then try again.';
        }
        setErrorMsg(message);
        return;
      }

      const role =
        (data.session?.user?.app_metadata as any)?.role ||
        (data.session?.user?.user_metadata as any)?.role ||
        'student';
      if (role === 'admin') navigate('/admin/overview', { replace: true });
      else if (role === 'instructor') navigate('/instructor/overview', { replace: true });
      else navigate('/student/overview', { replace: true });
    } catch (ex: any) {
      setErrorMsg(ex?.message || 'Unexpected error during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ maxWidth: 420, margin: '4rem auto' }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        {errorMsg && (
          <div className="error" role="alert" style={{ color: 'red', marginTop: 8 }}>
            {errorMsg}
          </div>
        )}
        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}

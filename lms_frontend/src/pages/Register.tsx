import React, { useState } from 'react';
// Always import from the JS shim to ensure CRA env resolution in all bundlers
import { supabase, getEmailRedirectTo } from '../lib/supabaseClient.js';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      const emailRedirectTo = getEmailRedirectTo();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role },
          emailRedirectTo,
        },
      });

      if (error) {
        let message = error.message || 'Registration failed. Please try again.';
        if (error?.code === 'email_not_confirmed' || /email not confirmed/i.test(message)) {
          message += ' Please confirm your email address, then try again.';
        }
        setErrorMsg(message);
      } else {
        const needsConfirmation = !data.session;
        setInfoMsg(
          needsConfirmation
            ? 'Registration successful. Please check your email to confirm your account.'
            : 'Registration successful.'
        );
      }
    } catch (ex: any) {
      setErrorMsg(ex?.message || 'Unexpected error during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ maxWidth: 420, margin: '4rem auto' }}>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginTop: 8 }}>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={{ marginTop: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          style={{ marginTop: 8 }}
        />
        {errorMsg && (
          <div className="error" role="alert" style={{ color: 'red', marginTop: 8 }}>
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div className="info" role="status" style={{ color: 'green', marginTop: 8 }}>
            {infoMsg}
          </div>
        )}
        <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </div>
  );
}

import React, { useState } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { AuthContext } from '../providers/AuthProvider';
import { sanitizeString } from '../utils/sanitize';
import { useNavigate } from 'react-router-dom';
import { EnvDiagnostics } from '../components/EnvDiagnostics';
import { getSupabaseEnvDiagnostics } from '../lib/supabaseClient.js';

// PUBLIC_INTERFACE
export default function Signup() {
  /** Basic signup form with mock auth. */
  const { signup } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const diag = getSupabaseEnvDiagnostics();
  const misconfigured = !diag.urlValid;

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const payload = {
        email: sanitizeString(email),
        password: password, // do not log
        role: sanitizeString(role),
      };
      const user = await signup(payload);
      if (user.role === 'admin') navigate('/admin', { replace: true });
      else if (user.role === 'instructor') navigate('/instructor', { replace: true });
      else navigate('/student', { replace: true });
    } catch (error) {
      setErr(error?.message || 'Signup failed.');
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h1>Signup</h1>
      <EnvDiagnostics lastError={err} />
      {misconfigured && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: 10, borderRadius: 6, marginBottom: 8 }}>
          Supabase is not configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in lms_frontend/.env, then restart the dev server.
        </div>
      )}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={misconfigured} />
        <div style={{ display: 'grid', gap: 6 }}>
          <label style={{ fontSize: 14 }}>Role</label>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)} disabled={misconfigured}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={misconfigured} />
        {err ? <div style={{ color: 'var(--color-error)' }}>{err}</div> : null}
        <Button type="submit" disabled={misconfigured}>Create Account</Button>
      </form>
    </div>
  );
}

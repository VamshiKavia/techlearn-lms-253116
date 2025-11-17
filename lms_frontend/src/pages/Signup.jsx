import React, { useState } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { AuthContext } from '../providers/AuthProvider';
import { sanitizeString } from '../utils/sanitize';
import { useNavigate } from 'react-router-dom';
import { EnvDiagnostics } from '../components/EnvDiagnostics';

// PUBLIC_INTERFACE
export default function Signup() {
  /** Basic signup form with mock auth. */
  const { signup } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

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
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <div style={{ display: 'grid', gap: 6 }}>
          <label style={{ fontSize: 14 }}>Role</label>
          <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {err ? <div style={{ color: 'var(--color-error)' }}>{err}</div> : null}
        <Button type="submit">Create Account</Button>
      </form>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';

/**
 * PUBLIC_INTERFACE
 * Account
 * Displays current user's email and provides a sign out action.
 */
export function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await signOut();
      navigate('/auth', { replace: true });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Sign out failed:', e?.message);
    }
  };

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1>Account</h1>
          <div className="subtitle">Manage your account details and session.</div>
        </div>
        <div aria-hidden="true" />
      </div>

      <div className="card" style={{ padding: 16, borderRadius: 12, display: 'grid', gap: 10 }}>
        <div style={{ display: 'grid', gap: 6 }}>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Signed in as</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            {user?.email || 'Unknown'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button className="btn btn-outline" onClick={() => navigate('/student/overview')}>Go to Dashboard</button>
          <button className="btn btn-primary" onClick={onLogout}>Sign out</button>
        </div>
      </div>
    </div>
  );
}

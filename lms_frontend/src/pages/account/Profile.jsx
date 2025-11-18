import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import { getSupabaseClient } from '../../core/clients/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * Profile
 * Allows the authenticated user to view and update their Display Name stored in Supabase user_metadata.display_name.
 * - Loads current value from session user metadata
 * - Updates via supabase.auth.updateUser({ data: { display_name } })
 * - Shows non-intrusive toasts for success/error
 * - Respects reduced motion
 */
export function Profile() {
  const { user, initializing } = useAuth();
  const supabase = useMemo(() => getSupabaseClient(), []);
  const [displayName, setDisplayName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [loading, setLoading] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    if (user) {
      const name =
        user?.user_metadata?.display_name ||
        user?.user_metadata?.name ||
        '';
      setDisplayName(name);
      setOriginalName(name);
    }
  }, [user]);

  // Reduced motion check
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const showToast = (type, message) => {
    setToast({ type, message });
    // Auto-dismiss after 3s (6s on error), avoid if reduced motion is set? We still auto-dismiss for usability.
    const timeout = type === 'error' ? 6000 : 3000;
    window.setTimeout(() => setToast({ type: '', message: '' }), timeout);
  };

  const onSave = async (e) => {
    e?.preventDefault?.();
    if (!user) return;
    // Light client-side validation: trim and length check
    const val = (displayName || '').trim();
    if (val.length > 80) {
      showToast('error', 'Display Name must be 80 characters or fewer.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: val },
      });
      if (error) throw new Error(error.message || 'Unable to update profile');
      // Optionally refresh local user via getUser() so other components reflect changes
      try {
        await supabase.auth.getUser();
      } catch {
        // best-effort; context subscription should update eventually
      }
      setOriginalName(val);
      showToast('success', 'Display Name saved.');
    } catch (ex) {
      showToast('error', ex?.message || 'Failed to save Display Name.');
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setDisplayName(originalName || '');
  };

  if (initializing) {
    return (
      <div className="card" style={{ padding: 16, borderRadius: 12 }}>
        Loading profile…
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const isDirty = (displayName || '').trim() !== (originalName || '').trim();

  return (
    <div>
      <div className="pageHeader">
        <div>
          <h1>Profile</h1>
          <div className="subtitle">Manage your display name used across the app.</div>
        </div>
        <div aria-hidden="true" />
      </div>

      {/* Toasts - non-intrusive, top-right in content area */}
      {toast.message && (
        <div
          role={toast.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          style={{
            position: 'sticky',
            top: 0,
            marginBottom: 12,
            zIndex: 1,
          }}
        >
          <div
            style={{
              background:
                toast.type === 'error' ? '#FEF2F2' : '#ECFDF5',
              border: `1px solid ${toast.type === 'error' ? '#FECACA' : '#D1FAE5'}`,
              color: toast.type === 'error' ? '#7F1D1D' : '#065F46',
              padding: '8px 10px',
              borderRadius: 8,
              boxShadow: 'var(--shadow-sm)',
              transition: prefersReducedMotion ? 'none' : 'transform var(--transition-base), opacity var(--transition-base)',
              transform: 'translateY(0)',
              opacity: 1,
            }}
          >
            {toast.message}
          </div>
        </div>
      )}

      <form onSubmit={onSave} noValidate>
        <div className="card" style={{ padding: 16, borderRadius: 12, display: 'grid', gap: 12, maxWidth: 520 }}>
          <div style={{ display: 'grid', gap: 6 }}>
            <label htmlFor="displayName" style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              className="ui-input"
              placeholder="e.g., Alex Johnson"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              aria-label="Display Name"
              aria-describedby="displayNameHelp"
              maxLength={120}
              style={{ height: 40 }}
            />
            <div id="displayNameHelp" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              This name appears on your certificates and public pages.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !isDirty}
              aria-busy={loading ? 'true' : 'false'}
            >
              {loading ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onReset}
              disabled={loading || !isDirty}
            >
              Reset
            </button>
          </div>

          <hr className="divider" />

          <div style={{ display: 'grid', gap: 6 }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
              Account Email
            </div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              {user?.email || 'Unknown'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Email changes must be done via your account settings or contact support.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Profile;

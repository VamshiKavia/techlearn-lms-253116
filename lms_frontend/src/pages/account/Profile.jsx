import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSupabaseClient } from '../../hooks/useSupabaseClient';

/**
 * Profile page for viewing and editing user's Display Name stored in Supabase user_metadata.
 * The page is protected and requires authentication via AuthContext.
 * Users can update their display name using supabase.auth.updateUser({ data: { display_name } }).
 *
 * Accessibility:
 * - Proper labels for form fields
 * - ARIA live regions for status messages
 * - Keyboard accessible buttons and inputs
 * - High color contrast respecting theme
 */
const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const supabase = useSupabaseClient();

  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }

  // Prefill display name from user.user_metadata.display_name
  useEffect(() => {
    if (user?.user_metadata) {
      setDisplayName(user.user_metadata.display_name || '');
    }
  }, [user]);

  if (authLoading) {
    return (
      <div style={{ padding: '1.5rem' }}>
        <p>Loading profile…</p>
      </div>
    );
  }

  if (!user) {
    // Protected route: if not authenticated, show a simple notice.
    return (
      <div style={{ padding: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Profile</h1>
        <p>You need to be signed in to view this page.</p>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { display_name: displayName?.trim() || '' },
      });
      if (error) {
        throw error;
      }
      // Set local confirmation
      setMessage({ type: 'success', text: 'Display Name updated successfully.' });
      // Optionally, you can also refresh local state from returned data.user
      // But AuthContext may update automatically; still, ensure field is updated.
      if (data?.user?.user_metadata?.display_name !== undefined) {
        setDisplayName(data.user.user_metadata.display_name);
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err?.message || 'Failed to update Display Name. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  // Theme-aware styles using existing minimalist style and #541161 accents
  const styles = {
    container: {
      padding: '1.5rem',
      maxWidth: 720,
      margin: '0 auto',
    },
    card: {
      background: 'var(--surface, #F9FAFB)',
      border: '1px solid rgba(0,0,0,0.06)',
      borderRadius: 12,
      padding: '1.25rem',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    },
    heading: {
      marginBottom: '0.75rem',
      fontSize: '1.5rem',
      lineHeight: 1.25,
      color: 'var(--text, #111827)',
    },
    subtext: {
      color: 'var(--secondary, #6B7280)',
      marginBottom: '1rem',
    },
    label: {
      display: 'block',
      fontWeight: 600,
      marginBottom: '0.5rem',
      color: 'var(--text, #111827)',
    },
    input: {
      width: '100%',
      padding: '0.625rem 0.75rem',
      borderRadius: 8,
      border: '1px solid rgba(0,0,0,0.15)',
      background: 'var(--background, #FFFFFF)',
      color: 'var(--text, #111827)',
      outline: 'none',
    },
    actions: {
      marginTop: '1rem',
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'center',
    },
    button: {
      backgroundColor: '#541161',
      color: '#FFFFFF',
      border: 'none',
      padding: '0.6rem 1rem',
      borderRadius: 8,
      cursor: 'pointer',
      fontWeight: 600,
    },
    buttonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    message: {
      marginTop: '0.5rem',
      fontSize: '0.95rem',
    },
    success: {
      color: '#10B981',
    },
    error: {
      color: '#EF4444',
    },
    fieldset: {
      border: 'none',
      padding: 0,
      margin: 0,
    },
  };

  const canSave = displayName !== undefined && displayName !== null;

  return (
    <div style={styles.container}>
      <div style={styles.card} role="region" aria-labelledby="profile-heading">
        <h1 id="profile-heading" style={styles.heading}>Profile</h1>
        <p style={styles.subtext}>
          Update your public display name. This may be visible on certificates, reviews, and community features.
        </p>

        <form onSubmit={onSubmit} aria-describedby="profile-status">
          <fieldset style={styles.fieldset}>
            <label htmlFor="displayName" style={styles.label}>
              Display Name
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={styles.input}
              placeholder="e.g., Alex Johnson"
              aria-required="true"
            />
          </fieldset>

          <div style={styles.actions}>
            <button
              type="submit"
              style={{
                ...styles.button,
                ...(saving || !canSave ? styles.buttonDisabled : {}),
              }}
              disabled={saving || !canSave}
              aria-disabled={saving || !canSave}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>

            <div
              id="profile-status"
              role="status"
              aria-live="polite"
              style={{
                ...styles.message,
                ...(message?.type === 'success' ? styles.success : {}),
                ...(message?.type === 'error' ? styles.error : {}),
              }}
            >
              {message?.text}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

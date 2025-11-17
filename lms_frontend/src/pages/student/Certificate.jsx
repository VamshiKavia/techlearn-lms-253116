import React, { useMemo } from 'react';
import { certificates as mockCertificates } from '../../shared/mocks/certificates';

/**
 * PUBLIC_INTERFACE
 * Certificates: Student Certificates page rendering a grid/list of earned certificates.
 * Frontend-only with local mock data; provides actions to view/download and verify (placeholder).
 */
export function Certificates() {
  const list = useMemo(() => mockCertificates, []);

  const formatDate = (d) => {
    try {
      const date = new Date(d);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return d;
    }
  };

  const onView = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      {/* Header */}
      <div className="pageHeader">
        <div>
          <h1>Certificates</h1>
          <div className="subtitle">
            View and manage your earned certificates. You can download issued certificates and verify credentials.
          </div>
        </div>
        <div aria-hidden="true" />
      </div>

      {/* Certificates grid */}
      <section
        style={{
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        }}
        aria-label="Certificates list"
      >
        {list.map((c) => {
          const issued = c.status === 'issued';
          return (
            <article
              key={c.id}
              className="card"
              style={{ padding: 16, borderRadius: 12, display: 'grid', gap: 10 }}
            >
              <header
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: 12,
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {c.courseTitle}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: issued ? 'var(--success)' : 'var(--text-muted)',
                    border: `1px solid ${issued ? 'var(--success)' : 'var(--border-subtle)'}`,
                    background: issued ? '#F0FDF4' : 'var(--bg-subtle)',
                    padding: '4px 8px',
                    borderRadius: 9999,
                  }}
                  aria-label={`Status ${c.status}`}
                >
                  {issued ? 'Issued' : 'Pending'}
                </span>
              </header>

              <dl
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr',
                  rowGap: 6,
                  columnGap: 12,
                  fontSize: 14,
                }}
              >
                <dt style={{ color: 'var(--text-muted)' }}>Issued on</dt>
                <dd style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  {formatDate(c.issuedOn)}
                </dd>

                <dt style={{ color: 'var(--text-muted)' }}>Credential ID</dt>
                <dd style={{ margin: 0, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {c.credentialId}
                </dd>

                <dt style={{ color: 'var(--text-muted)' }}>Certificate ID</dt>
                <dd style={{ margin: 0, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {c.id}
                </dd>
              </dl>

              <div style={{ display: 'flex', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => onView(c.downloadUrl)}
                  disabled={!c.downloadUrl}
                  aria-disabled={!c.downloadUrl}
                  title={c.downloadUrl ? 'View/Download certificate' : 'Download unavailable yet'}
                >
                  {c.downloadUrl ? 'View / Download' : 'Download Unavailable'}
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    // Placeholder verify action; will integrate later.
                    // eslint-disable-next-line no-alert
                    alert('Verify placeholder: integration to be added later.');
                  }}
                >
                  Verify
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {list.length === 0 && (
        <div
          className="card"
          style={{
            padding: 16,
            borderRadius: 12,
            color: 'var(--text-secondary)',
            marginTop: 12,
          }}
        >
          No certificates yet. Complete courses to earn certificates.
        </div>
      )}
    </div>
  );
}

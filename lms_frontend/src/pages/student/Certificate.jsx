import React, { useMemo, useRef, useState } from 'react';
import { certificates as mockCertificates } from '../../shared/mocks/certificates';
import { CertificatePreview } from '../../components/common/CertificatePreview';
import { exportNodeToPng, exportNodeToPdf } from '../../shared/utils/export';

/**
 * PUBLIC_INTERFACE
 * Certificates: Student Certificates page rendering a grid/list of earned certificates.
 * Frontend-only with local mock data; provides actions to preview and export as PNG/PDF.
 */
export function Certificates() {
  const list = useMemo(() => mockCertificates, []);
  const [previewCert, setPreviewCert] = useState(null);
  const previewRef = useRef(null);

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

  const handleOpenPreview = (cert) => setPreviewCert(cert);
  const handleClosePreview = () => setPreviewCert(null);

  const handleDownloadPng = async () => {
    if (!previewRef.current || !previewCert) return;
    const filename = `${slugify(previewCert.courseTitle)}-${previewCert.id}.png`;
    await exportNodeToPng(previewRef.current, { filename, pixelRatio: 2 });
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current || !previewCert) return;
    const filename = `${slugify(previewCert.courseTitle)}-${previewCert.id}.pdf`;
    await exportNodeToPdf(previewRef.current, { filename, orientation: 'landscape', pageSize: 'a4', pixelRatio: 2 });
  };

  const slugify = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div>
      {/* Header */}
      <div className="pageHeader">
        <div>
          <h1>Certificates</h1>
          <div className="subtitle">
            Preview and download your earned certificates. Exports are generated on-device as PNG or PDF.
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
              className="card reveal"
              data-card
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
                  onClick={() => handleOpenPreview(c)}
                  aria-label={`Preview certificate ${c.id}`}
                  title="Preview certificate"
                  disabled={!issued}
                >
                  Preview
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => handleOpenPreview(c)}
                  aria-label={`Download PNG for certificate ${c.id}`}
                  title="Download PNG"
                  disabled={!issued}
                >
                  Download PNG
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => handleOpenPreview(c)}
                  aria-label={`Download PDF for certificate ${c.id}`}
                  title="Download PDF"
                  disabled={!issued}
                >
                  Download PDF
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

      {/* Modal for preview and export */}
      {previewCert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Certificate preview modal"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            zIndex: 50,
          }}
          onClick={(e) => {
            // close on clicking outside the panel
            if (e.target === e.currentTarget) handleClosePreview();
          }}
        >
          <div
            className="card reveal"
            style={{
              width: 'min(1080px, 96vw)',
              maxHeight: '92vh',
              background: 'var(--bg-panel)',
              borderRadius: 12,
              padding: 16,
              display: 'grid',
              gap: 12,
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                Certificate Preview
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" onClick={handleDownloadPng}>
                  Download PNG
                </button>
                <button className="btn btn-outline" onClick={handleDownloadPdf}>
                  Download PDF
                </button>
                <button className="btn btn-primary" onClick={handleClosePreview}>
                  Close
                </button>
              </div>
            </div>

            <div
              style={{
                overflow: 'auto',
                padding: 8,
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                background: 'var(--bg-subtle)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CertificatePreview
                  ref={previewRef}
                  studentName="Student Name"
                  courseTitle={previewCert.courseTitle}
                  issueDateFormatted={formatDate(previewCert.issuedOn)}
                  certificateId={previewCert.id}
                  credentialId={previewCert.credentialId}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

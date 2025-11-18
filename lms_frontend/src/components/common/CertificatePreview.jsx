import React, { forwardRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * CertificatePreview
 * A styled, print-friendly certificate preview card that shows student name, course title,
 * issue date, and certificate identifiers. Designed for client-side PNG/PDF export.
 *
 * @param {object} props
 * @param {string} props.studentName
 * @param {string} props.courseTitle
 * @param {string} props.issueDateFormatted
 * @param {string} props.certificateId
 * @param {string} props.credentialId
 */
export const CertificatePreview = forwardRef(function CertificatePreview(
  { studentName, courseTitle, issueDateFormatted, certificateId, credentialId },
  ref
) {
  // Using inline styles to ensure export libraries capture exact visuals (no external CSS scoping issues)
  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Certificate preview for ${studentName} - ${courseTitle}`}
      style={{
        width: 960,
        maxWidth: '100%',
        aspectRatio: '4 / 3',
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 18,
        boxShadow: '0 12px 28px rgba(2,6,23,0.12)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Top band / header */}
      <div
        style={{
          background: 'linear-gradient(90deg, #0B1220 0%, #1F2937 100%)',
          color: '#FFFFFF',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: 0.2 }}>TechLearn</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>Certificate of Completion</div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <div style={{ color: '#6B7280', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
            This certifies that
          </div>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.3px', marginTop: 10 }}>
            {studentName}
          </div>
          <div style={{ color: '#6B7280', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, marginTop: 12 }}>
            has successfully completed
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginTop: 8 }}>
            {courseTitle}
          </div>
        </div>

        <div
          style={{
            marginTop: 8,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
            alignItems: 'end',
          }}
        >
          <div style={{ color: '#4B5563', fontSize: 14 }}>
            <div style={{ color: '#6B7280', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Issued on
            </div>
            <div style={{ fontWeight: 600, marginTop: 6 }}>{issueDateFormatted}</div>
          </div>

          <div style={{ textAlign: 'right', color: '#4B5563', fontSize: 14 }}>
            <div style={{ color: '#6B7280', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Certificate ID
            </div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, marginTop: 6 }}>{certificateId}</div>
          </div>
        </div>

        {/* Bottom band with credential */}
        <div
          style={{
            marginTop: 'auto',
            borderTop: '1px dashed #E5E7EB',
            paddingTop: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ color: '#6B7280', fontSize: 12 }}>Credential</div>
          <div style={{ fontFamily: 'monospace', color: '#111827', fontWeight: 700 }}>{credentialId}</div>
        </div>
      </div>

      {/* Footer line */}
      <div style={{ padding: '10px 24px', background: '#F7F8FA', borderTop: '1px solid #E5E7EB', fontSize: 12, color: '#6B7280' }}>
        Verify at techlearn.example/verify using your Credential ID
      </div>
    </div>
  );
});

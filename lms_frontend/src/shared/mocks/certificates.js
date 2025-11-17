//
// Mock certificates for the Student Certificates page (frontend-only)
// Each certificate has: id, courseTitle, issuedOn (ISO), credentialId, status ('issued' | 'pending'),
// and optional downloadUrl for a PDF or badge image.
export const certificates = [
  {
    id: 'cert-001',
    courseTitle: 'Full Stack React & Node.js',
    issuedOn: '2025-10-20',
    credentialId: 'FSRN-9X2K-2025',
    status: 'issued',
    downloadUrl: 'https://example.com/certs/FSRN-9X2K-2025.pdf',
  },
  {
    id: 'cert-002',
    courseTitle: 'Python for Data Science & ML',
    issuedOn: '2025-09-15',
    credentialId: 'PDSML-7QW1-2025',
    status: 'issued',
    downloadUrl: 'https://example.com/certs/PDSML-7QW1-2025.pdf',
  },
  {
    id: 'cert-003',
    courseTitle: 'AWS Core Services',
    issuedOn: '2025-11-05',
    credentialId: 'AWS-CORE-AB12-2025',
    status: 'pending',
    // No download yet
  },
  {
    id: 'cert-004',
    courseTitle: 'Modern Web Testing with Cypress',
    issuedOn: '2025-08-02',
    credentialId: 'MWTC-55TT-2025',
    status: 'issued',
    downloadUrl: 'https://example.com/certs/MWTC-55TT-2025.pdf',
  },
];

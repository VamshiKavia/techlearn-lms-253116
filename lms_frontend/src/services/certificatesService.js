import { z } from 'zod';

const certificateSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuer: z.string(),
  issuedAt: z.string(),
  progress: z.number().optional(), // if <100, shows progress towards earning
});

// PUBLIC_INTERFACE
export function createCertificatesService(_api) {
  /**
   * Certificates service with mock data.
   */
  const items = [
    {
      id: 'cert1',
      title: 'Full-Stack Development Certificate',
      issuer: 'TechLearn',
      issuedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
    {
      id: 'cert2',
      title: 'Data Science Foundation Certificate',
      issuer: 'TechLearn',
      issuedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      id: 'cert3',
      title: 'Cloud Practitioner (In Progress)',
      issuer: 'TechLearn',
      issuedAt: new Date().toISOString(),
      progress: 65,
    },
  ];

  return {
    /**
     * PUBLIC_INTERFACE
     * List earned and in-progress certificates.
     */
    async list() {
      return items.map((c) => certificateSchema.parse(c));
    },
  };
}

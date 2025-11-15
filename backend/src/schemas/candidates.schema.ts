import { z } from 'zod';

export const candidateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  college: z.string().optional(),
  branch: z.string().optional(),
  graduationYear: z.number().optional(),
  roleOffered: z.string().optional(),
  packageOffered: z.string().optional(),
  profileImageUrl: z.string().optional(),
  quote: z.string().optional(),
  linkedinUrl: z.string().optional(),
  companyId: z.string().min(1, 'Company ID is required'),
});

export const candidateUpdateSchema = candidateSchema.partial();
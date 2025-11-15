import { z } from 'zod';

export const createCompanySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Company name is required')
      .max(100, 'Company name must be less than 100 characters'),
    description: z
      .string()
      .max(500, 'Description must be less than 500 characters')
      .optional(),
  }),
});

export const updateCompanySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Company name is required')
      .max(100, 'Company name must be less than 100 characters')
      .optional(),
    description: z
      .string()
      .max(500, 'Description must be less than 500 characters')
      .optional(),
  }),
});

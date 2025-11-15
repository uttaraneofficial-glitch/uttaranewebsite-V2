import { z } from 'zod';

export const createVideoSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be less than 200 characters'),
    description: z
      .string()
      .max(1000, 'Description must be less than 1000 characters')
      .optional(),
    url: z.string().url('Must be a valid URL'),
    thumbnailUrl: z.string().url('Must be a valid URL').optional(),
    duration: z.number().positive('Duration must be positive').optional(),
    isPublished: z.boolean().optional().default(false),
  }),
});

export const updateVideoSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, 'Title is required')
      .max(200, 'Title must be less than 200 characters')
      .optional(),
    description: z
      .string()
      .max(1000, 'Description must be less than 1000 characters')
      .optional(),
    url: z.string().url('Must be a valid URL').optional(),
    thumbnailUrl: z.string().url('Must be a valid URL').optional(),
    duration: z.number().positive('Duration must be positive').optional(),
    isPublished: z.boolean().optional(),
  }),
});

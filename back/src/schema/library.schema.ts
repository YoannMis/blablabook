import { z } from 'zod';

export const getUserLibraryQuerySchema = z.object({
  status: z
    .string()
    .refine((value) => value === 'read' || value === 'wishlist' || value === 'all', {
      message: 'Status must be read, whislist or all',
    })
    .optional()
    .default('all'),
  offset: z.coerce
    .number()
    .refine((value) => value % 20 === 0, {
      message: 'Number must be a multiple of 20',
    })
    .min(0)
    .optional()
    .default(0),
});

export type LibraryQuerySchema = z.infer<typeof getUserLibraryQuerySchema>;

export const searchQuerySchema = z.object({
  q: z.string().min(1, 'q param is required'),
  status: z
    .string()
    .refine((value) => value === 'read' || value === 'wishlist' || value === 'all', {
      message: 'Status must be read, whislist or all',
    })
    .optional()
    .default('all'),
  offset: z.coerce
    .number()
    .refine((value) => value % 20 === 0, {
      message: 'Number must be a multiple of 20',
    })
    .min(0)
    .optional()
    .default(0),
});

export type SearchQuerySchema = z.infer<typeof searchQuerySchema>;

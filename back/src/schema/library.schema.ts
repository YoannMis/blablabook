import { z } from 'zod';

export const getUserLibraryQuerySchema = z.object({
  status: z.literal(['read', 'wishlist', 'all']).optional().default('all'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(20),
});

export type LibraryQuerySchema = z.infer<typeof getUserLibraryQuerySchema>;

export const searchQuerySchema = z.object({
  q: z.string().min(1, 'q param is required'),
  status: z.literal(['read', 'wishlist', 'all']).optional().default('all'),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).optional().default(20),
});

export type SearchQuerySchema = z.infer<typeof searchQuerySchema>;

export const statusSchema = z.object({
  status: z.literal(['read', 'wishlist']),
});

export const bookSchema = z.object({
  googleId: z.string().min(1),
  title: z.string().min(1),
  averageRating: z.number().optional(),
  ratingCount: z.number().default(0),
  imageLinks: z
    .object({
      smallThumbnail: z.string().optional(),
      thumbnail: z.string().optional(),
      small: z.string().optional(),
      medium: z.string().optional(),
      large: z.string().optional(),
      extraLarge: z.string().optional(),
    })
    .optional(),
  language: z.string().optional(),
  description: z.string().optional(),
  publishedDate: z.string().optional(),
  isbn10: z.string().optional(),
  isbn13: z.string().optional(),
  pageCount: z.number().optional(),
  publisher: z.string().optional(),
  authors: z.array(z.string().min(1)),
  categories: z.array(z.string().min(1)),
});

export const createBookSchema = z.object({
  book: bookSchema,
  status: z.literal(['read', 'wishlist']),
});

export type CreateBookSchema = z.infer<typeof createBookSchema>;

export type BookSchema = z.infer<typeof bookSchema>;

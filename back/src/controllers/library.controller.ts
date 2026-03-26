import { z } from 'zod';
import type { Response } from 'express';

import { prisma } from '../utils/prisma.utils';
import type { AuthRequest } from '../middlewares/auth.middleware';
import type { UserBook, ReadingStatus } from '../utils/prisma.utils';

const getUserLibraryQuerySchema = z.object({
  status: z.string().optional().default('all'),
  offset: z.coerce
    .number()
    .refine((value) => value % 20 === 0, {
      message: 'Number must be a multiple of 20',
    })
    .min(0)
    .optional()
    .default(0),
});

/**
 * Retrieves all books belonging to a connected user with pagination support.
 * This function queries the database for books associated with the user's ID,
 * which is extracted from the authenticated request. Pagination is handled
 * by the backend with a default limit of 20 books per page and an starting offset of 0.
 *
 * @param req - The authenticated request object containing the user's ID.
 * @param res - The response object used to send the books data or an error message.
 * @returns A Promise that resolves when the response is sent.
 */
export const getUserLibrary = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = getUserLibraryQuerySchema.safeParse(req.query);

  try {
    const userId = req.userId;
    const query = parsed.data;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    // Pagination settings
    const limit = 20; // Default limit of 20 books per page
    const offset = query?.offset ? query.offset : 0; // Default offset starting at 0

    let userBooks: UserBook[];
    let total: number; // the total count of books for the user

    // Query the database for books associated with the user with pagination
    if (query?.status && query.status !== 'all') {
      userBooks = await prisma.userBook.findMany({
        where: {
          userId: userId,
          status: query.status as ReadingStatus,
        },
        include: {
          book: true,
        },
        skip: offset,
        take: limit,
      });

      total = await prisma.userBook.count({
        where: {
          userId: userId,
          status: query.status as ReadingStatus,
        },
      });
    } else {
      userBooks = await prisma.userBook.findMany({
        where: {
          userId: userId,
        },
        include: {
          book: true,
        },
        skip: offset,
        take: limit,
      });

      total = await prisma.userBook.count({
        where: {
          userId: userId,
        },
      });
    }

    // Calculate pagination metadata
    const hasNext = offset + limit < total;
    const hasPrevious = offset > 0;

    res.json({
      pagination: {
        total,
        hasNext,
        hasPrevious,
      },
      data: userBooks,
    });
  } catch (error) {
    console.error('Error fetching user library:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

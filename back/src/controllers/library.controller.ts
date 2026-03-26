import type { Response } from 'express';
import { prisma } from '../utils/prisma.utils';
import type { AuthRequest } from '../middlewares/auth.middleware';

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
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    // Pagination settings
    const limit = 20; // Default limit of 20 books per page
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0; // Default offset starting at 0

    // Query the database for books associated with the user with pagination
    const userBooks = await prisma.userBook.findMany({
      where: {
        userId: userId,
      },
      include: {
        book: true,
      },
      skip: offset,
      take: limit,
    });

    // Get the total count of books for the user
    const total = await prisma.userBook.count({
      where: {
        userId: userId,
      },
    });

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

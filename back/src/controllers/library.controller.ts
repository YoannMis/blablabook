import type { Response } from 'express';
import { prisma } from '../utils/prisma.utils';
import type { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Retrieves all books belonging to a connected user.
 * This function queries the database for books associated with the user's ID,
 * which is extracted from the authenticated request.
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

    // Query the database for books associated with the user
    const userBooks = await prisma.userBook.findMany({
      where: {
        userId: userId,
      },
      include: {
        book: true,
      },
    });

    res.json(userBooks);
  } catch (error) {
    console.error('Error fetching user library:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

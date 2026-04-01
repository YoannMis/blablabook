import { z } from 'zod';
import type { Response } from 'express';

import type { AuthRequest } from '../middlewares/auth.middleware';
import {
  getUserBooksByQuery,
  getUserLibraryBooks,
  formatBooks,
  findBookInLibrary,
  updateUserBook,
  deleteUserBook,
  checkIsExistsBook,
  addBookToLibrary,
  createBook,
} from '../services/library.service';
import {
  createBookSchema,
  getUserLibraryQuerySchema,
  searchQuerySchema,
  statusSchema,
  type LibraryQuerySchema,
  type SearchQuerySchema,
} from '../schema/library.schema';
import { checkIdFromParams } from '../lib/validators';
import { getBookById } from '../services/googleBooks.service';

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
  const parsed: z.ZodSafeParseResult<LibraryQuerySchema> = getUserLibraryQuerySchema.safeParse(
    req.query
  );

  if (!parsed.success) {
    res.status(400).json({ error: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  try {
    const userId = req.userId;
    const query = parsed.data;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    // Pagination settings
    const limit = query?.limit ? query?.limit : 20; // Default limit of 20 books per page
    const offset = query?.page ? (query.page - 1) * limit : 0; // Default offset starting at 0
    const page = query.page;

    const { userBooks, total } = await getUserLibraryBooks(userId, query?.status, limit, offset);

    // Calculate pagination metadata
    const hasNext = offset + limit < total;
    const hasPrevious = offset > 0;

    const formattedBooks = formatBooks(userBooks);

    res.json({
      pagination: { total, page, hasNext, hasPrevious },
      data: formattedBooks,
    });
  } catch (error) {
    console.error('Error fetching user library:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

/**
 * Searches for books in a user's library with optional query filtering and pagination.
 *
 * @param req - The authenticated request object containing the user's ID and search parameters.
 * @param res - The response object used to send the search results or an error message.
 * @returns A Promise that resolves when the response is sent.
 */
export const searchInLibrary = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed: z.ZodSafeParseResult<SearchQuerySchema> = searchQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ error: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  try {
    const userId = req.userId;
    const query = parsed.data;

    if (!userId) {
      res.status(401).json({ success: false, message: 'User not authenticated' });
      return;
    }

    // Pagination settings
    const limit = query?.limit ? query?.limit : 20; // Default limit of 20 books per page
    const offset = query?.page ? (query.page - 1) * limit : 0; // Default offset starting at 0
    const page = query.page;

    const { userBooks, total } = await getUserBooksByQuery(
      userId,
      query?.q,
      query?.status,
      limit,
      offset
    );

    // Calculate pagination metadata
    const hasNext = offset + limit < total;
    const hasPrevious = offset > 0;

    const formattedBooks = formatBooks(userBooks);

    res.json({
      pagination: { total, page, hasNext, hasPrevious },
      data: formattedBooks,
    });
  } catch (error) {
    console.error('Error fetching user library:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

/**
 * Updates the status of a book in the user's library.
 *
 * @param req - The authenticated request object containing the user's ID, book ID, and new status.
 * @param res - The response object used to send the updated book data or an error message.
 * @returns A Promise that resolves when the response is sent.
 */
export const updateBookStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId as number;
  const bookId = await checkIdFromParams(req.params.id as string);
  const userBookId = { userId, bookId };

  const userBook = await findBookInLibrary(userBookId);
  if (!userBook) {
    res.status(404).json({ error: "Book doesn't exist in library" });
  }

  const parsed = statusSchema.safeParse(req.body);
  console.log(parsed.data);
  if (parsed.error) {
    res.status(400).json({ success: false, error: z.flattenError(parsed.error).fieldErrors });
  }

  try {
    const data = await updateUserBook(userBookId, parsed.data?.status);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

/**
 * Deletes a book in the user's library.
 *
 * @param req - The authenticated request object containing the user's ID and book ID.
 * @param res - The response object used to send success or an error message.
 * @returns A Promise that resolves when the response is sent.
 */
export const deleteBookFromLibrary = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId as number;
  const bookId = await checkIdFromParams(req.params.id as string);
  const userBookId = { userId, bookId };

  const userBook = await findBookInLibrary(userBookId);
  if (!userBook) {
    res.status(404).json({ error: "Book doesn't exist in library" });
  }

  try {
    await deleteUserBook(userBookId);

    res.status(204).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

/**
 * Creates a new book or adds an existing book to the user's library.
 * This function first checks if the book already exists in the database.
 * If it exists, it adds the book to the user's library if not already present.
 * If the book does not exist, it creates a new book in the database and adds it to the user's library.
 *
 * @param req - The authenticated request object containing the user's ID and book details.
 * @param res - The response object used to send success or an error message.
 * @returns A Promise that resolves when the response is sent.
 */
export const createAndAddBookToLibrary = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId as number;

  try {
    const { book, status } = createBookSchema.parse(req.body);

    const foundBook = await checkIsExistsBook(book.googleId);

    if (foundBook) {
      const userBookId = {
        userId: userId,
        bookId: foundBook.id,
      };

      const userBook = await findBookInLibrary(userBookId);
      if (userBook) {
        res.status(400).json({
          success: false,
          error: 'BOOK_ALREADY_IN_LIBRARY',
        });
        return;
      }

      const data = {
        ...userBookId,
        status: status,
      };

      await addBookToLibrary(data);
    } else {
      const googleBook = await getBookById(book.googleId);
      book.categories = googleBook.categories ? googleBook.categories : [];
      await createBook(userId, status, book);
    }

    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'INTERNAL_SERVER_ERROR',
    });
    return;
  }
};

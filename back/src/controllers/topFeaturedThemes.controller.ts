import type { Request, Response } from 'express';
import { z } from 'zod';
import { type GoogleBook, searchBooks } from '../services/googleBooks.service';

interface ITopFeaturedThemes {
  dragon: string;
  gardening: string;
}

interface Idata {
  dragon?: GoogleBook[];
  gardening?: GoogleBook[];
}

/**
 * Controller for handling top featured themes requests.
 */
const controller = {
  /**
   * Retrieves the top featured books for predefined themes with pagination support.
   *
   * Expected query parameters:
   *   - limit: Maximum number of results per page (default: 20, max: 40)
   *   - page: Page number (default: 1)
   */
  getTopFeaturedThemes: async (req: Request, res: Response): Promise<void> => {
    const paginationSchema = z.object({
      limit: z.coerce.number().min(1).max(40).default(20),
      page: z.coerce.number().min(1).default(1),
    });

    try {
      // Validate and parse pagination parameters from query string
      const parsed = paginationSchema.safeParse(req.query);

      if (!parsed.success) {
        res.status(400).json({ error: z.flattenError(parsed.error).fieldErrors });
        return;
      }

      const { limit, page } = parsed.data;

      // Define the top featured themes and their search queries
      const topFeaturedThemes: ITopFeaturedThemes = {
        dragon: 'dragon',
        gardening: 'jardinage',
      };

      const data: Idata = {};

      // Fetch and paginate books for each theme
      for (const theme in topFeaturedThemes) {
        const key = theme as keyof ITopFeaturedThemes;
        const books = await searchBooks(topFeaturedThemes[key]);
        const startIndex = (page - 1) * limit;
        const paginatedBooks = books.slice(startIndex, startIndex + limit);
        data[key] = paginatedBooks;
      }

      res.json({
        page,
        limit,
        data,
      });
      // TODO: Implement error handler
    } catch (error) {
      res.status(502).json({ error: 'Something wrong with Google Books API' });
      if (error instanceof Error) {
        console.log(error.name, error.message);
      }
    }
  },
};

export default controller;

import type { Request, Response } from 'express';
import { z } from 'zod';
import axios from 'axios';

import { getBookById, searchBooks } from '../services/googleBooks.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { prisma } from '../utils/prisma.utils';
import { findBookInLibrary, formatBook } from '../services/library.service';

const searchQuerySchema = z.object({
  q: z.string().min(1, 'Le paramètre q est requis'),
  maxResults: z.coerce.number().min(1).max(40).optional(),
  startIndex: z.coerce.number().min(0).optional().default(0),
  lang: z.string().optional().default('en'),
});

export const search = async (req: Request, res: Response): Promise<void> => {
  const parsed = searchQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ error: z.flattenError(parsed.error).fieldErrors });
    return;
  }

  try {
    const { q, maxResults, startIndex } = parsed.data;
    const books = await searchBooks(q, maxResults, startIndex);
    res.json(books);
  } catch {
    res.status(502).json({ error: "Impossible de contacter l'API Google Books" });
  }
};

export const getById = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.userId as number;
  const parsedId = z.string().min(1).safeParse(req.params.id);

  if (!parsedId.success) {
    res.status(400).json({ success: false, error: z.flattenError(parsedId.error).fieldErrors });
  }

  const googleBookId = parsedId.data as string;

  try {
    // TODO: Import this function from a service
    const existingBook = await prisma.book.findUnique({
      where: {
        googleBookId,
      },
      include: {
        publisher: {
          select: {
            name: true,
          },
        },
        authors: {
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        },
        categories: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (existingBook) {
      const formattedBook = formatBook(existingBook);
      if (userId) {
        const isUserBook = await findBookInLibrary({ userId, bookId: existingBook.id });
        const bookStatus = isUserBook && isUserBook.status;

        res.status(200).json({
          userId,
          book: {
            ...formattedBook,
            status: bookStatus,
          },
        });
      } else {
        res.status(200).json(formattedBook);
      }
      return;
    }

    const book = await getBookById(googleBookId);
    res.status(200).json(book);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      res.status(404).json({ error: 'Livre introuvable' });
      return;
    }
    res.status(502).json({ error: "Impossible de contacter l'API Google Books" });
  }
};

import { Request, Response } from 'express';
import { z } from 'zod';
import { getBookById, searchBooks } from '../services/googleBooks.service.js';

const searchQuerySchema = z.object({
  q: z.string().min(1, 'Le paramètre q est requis'),
  maxResults: z.coerce.number().min(1).max(40).optional(),
});

export async function search(req: Request, res: Response): Promise<void> {
  const parsed = searchQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const { q, maxResults } = parsed.data;
  const books = await searchBooks(q, maxResults);
  res.json(books);
}

export async function getById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const book = await getBookById(id);
  res.json(book);
}

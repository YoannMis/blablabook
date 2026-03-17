import type { Request, Response } from 'express';
import { z } from 'zod';
import axios from 'axios';
import { getBookById, searchBooks } from '../services/googleBooks.service';

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

  try {
    const { q, maxResults } = parsed.data;
    const books = await searchBooks(q, maxResults);
    res.json(books);
  } catch {
    res.status(502).json({ error: "Impossible de contacter l'API Google Books" });
  }
}

export async function getById(req: Request<{ id: string }>, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const book = await getBookById(id);
    res.json(book);
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      res.status(404).json({ error: 'Livre introuvable' });
      return;
    }
    res.status(502).json({ error: "Impossible de contacter l'API Google Books" });
  }
}

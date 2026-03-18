import { Router } from 'express';
import { getById, search } from '../controllers/books.controller.js';

const booksRouter = Router();

// GET /api/books/search?q=fondation&maxResults=20
booksRouter.get('/search', search);

// GET /api/books/:id
booksRouter.get('/:id', getById);

export default booksRouter;

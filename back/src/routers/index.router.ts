import { Router } from 'express';

import booksRouter from './books.router';

const router = Router();

router.use('/books', booksRouter);

export default router;

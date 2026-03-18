import { Router } from 'express';

import booksRouter from './books.router';
import topFeaturedThemesRouter from './topFeaturedThemes.router';

const router = Router();

router.use('/books', booksRouter);
router.use('/topFeaturedThemes', topFeaturedThemesRouter);

export default router;

import { Router } from 'express';
import topFeaturedThemesController from '../controllers/topFeaturedThemes.controller';

const router = Router();

router.get('/', topFeaturedThemesController.getTopFeaturedThemes);

export default router;

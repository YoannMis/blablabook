import { Router } from 'express';
import {
  getCurrentUserController,
  loginUserController,
  registerUserController,
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const authRouter = Router();

authRouter.post('/register', registerUserController);
authRouter.post('/login', loginUserController);
authRouter.get('/me', authenticateToken, getCurrentUserController);
// authRouter.post('/logout');

export default authRouter;

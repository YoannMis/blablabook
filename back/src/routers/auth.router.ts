import { Router } from 'express';
import { loginUserController, registerUserController } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/register', registerUserController);
authRouter.post('/login', loginUserController);
// authRouter.post('/logout');

export default authRouter;

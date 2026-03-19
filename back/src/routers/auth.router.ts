import { Router } from 'express';
import { Login, registerUser } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', Login);
// authRouter.post('/logout');

export default authRouter;

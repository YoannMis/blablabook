import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { xss } from 'express-xss-sanitizer';
import booksRouter from './routers/books.router.js';
import authRouter from './routers/auth.router.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(xss());

app.use('/api/books', booksRouter);
app.use('/api/auth', authRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

export default app;

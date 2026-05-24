import { Response } from 'express';

type CookieOptions = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: boolean | 'strict' | 'lax' | 'none' | undefined;
  path: string;
};

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/api',
};

export const clearCookiesUser = (res: Response): void => {
  res.clearCookie('token', cookieOptions);
  res.clearCookie('refreshtoken', cookieOptions);
};

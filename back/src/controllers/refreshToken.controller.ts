import { Request, Response } from 'express';
import { refreshUserToken } from '../services/auth.service.js';
import { convertInMs } from '../utils/time.utils.js';

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const { token, user } = await refreshUserToken(refreshToken);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: convertInMs(process.env.JWT_EXPIRES_IN as string),
    });

    return res.json({ success: true, data: user });
  } catch (error: any) {
    console.error('refreshTokenController error:', error);
    return res.status(error?.status || 401).json({
      success: false,
      message: error?.message || 'Could not refresh token',
    });
  }
};

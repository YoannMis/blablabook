import type z from 'zod';
import { AuthSchema, LoginSchema } from '../schema/auth.schema';
import type { Request, Response } from 'express';
import argon2 from 'argon2';
import { prisma } from '../utils/prisma.utils';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { convertInMs } from '../utils/time.utils';

//Typage Typescript
type AuthFormValues = z.infer<typeof AuthSchema>;
type LoginFormValues = z.infer<typeof LoginSchema>;

//function d'enregistrement d'un utilisateur dans la base de données avec les informations fournie par le frontend
export const registerUser = async (req: Request, res: Response) => {
  try {
    // validation du body de la requête
    const { username, email, password, confirmPassword } = AuthSchema.parse(
      req.body
    ) as AuthFormValues;

    // validation des mots de passe
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    //verification que l'utilisateur n'existe pas deja
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User or email already exists' });
    }

    // hachage du mot de passe avec argon 2
    const hashedPassword = await argon2.hash(password);

    // enregistrement de l'utilisateur dans la base de données
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return res
      .status(201)
      .json({ success: true, message: 'User created successfully', data: user });
  } catch (error) {
    // gestion des erreurs
    if (error instanceof Error) {
      console.error('Registration error:', error.message);
      return res.status(500).json({ success: false, message: 'Registration error' });
    }
    return res.status(500).json({ success: false, message: 'Unknown error' });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    // validation du body de la requête
    const { email, password } = LoginSchema.parse(req.body) as LoginFormValues;

    // recherche de l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Invalid User or Email' });
    }

    // verification du mot de passe
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid User or Email' });
    }

    //generation d'un token jwt
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN as string }
    );

    //generation d'un refreshtoken
    const refreshtoken = crypto.randomBytes(128).toString('base64');
    const refreshTokenExpiresAt = new Date(
      Date.now().valueOf() + convertInMs(process.env.REFRESH_TOKEN_EXPIRES_IN as string)
    );

    //enregistrement du refreshtoken en bdd
    await prisma.refreshToken.create({
      data: {
        token: refreshtoken,
        userId: user.id,
        issued_at: new Date(),
        expires_at: refreshTokenExpiresAt,
      },
    });

    //envoi du token et du refreshtoken au frontend
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: convertInMs(process.env.JWT_EXPIRES_IN as string),
      path: '/api',
    });
    res.cookie('refreshtoken', refreshtoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: convertInMs(process.env.REFRESH_TOKEN_EXPIRES_IN as string),
      path: '/api/auth',
    });

    //response au frontend de la reussite de la connexion
    return res.status(200).json({ success: true, message: 'Login successful', data: { token } });
  } catch (error) {
    // gestion des erreurs
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Login error' });
  }
};

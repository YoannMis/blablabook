import type z from 'zod';
import { AuthSchema, LoginSchema } from '../schema/auth.schema';
import type { Request, Response } from 'express';
import { convertInMs } from '../utils/time.utils';
import { login, registerUser } from '../services/auth.service';

//Typage Typescript
type AuthFormValues = z.infer<typeof AuthSchema>;
type LoginFormValues = z.infer<typeof LoginSchema>;

//function d'enregistrement d'un utilisateur dans la base de données avec les informations fournie par le frontend
export const registerUserController = async (req: Request, res: Response) => {
  try {
    // validation du body de la requête
    const { username, email, password, confirmPassword }: AuthFormValues = AuthSchema.parse(
      req.body
    );

    // validation des mots de passe
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // appelle auth service pour enregistrer l'utilisateur
    const user = await registerUser({ username, email, password, confirmPassword });

    // creation d'une constante newuser contenant les information de user sans le password
    const newuser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    // renvoi de la résponse
    return res
      .status(201)
      .json({ success: true, message: 'User created successfully', data: newuser });
  } catch (error) {
    // gestion des erreurs
    if (error instanceof Error) {
      if (error.message === 'USERNAME_ALREADY_TAKEN') {
        return res.status(409).json({ success: false, message: 'Username already taken' });
      }
      console.error('Registration error:', error.message);
      return res.status(500).json({ success: false, message: 'Registration error' });
    }
    return res.status(500).json({ success: false, message: 'Unknown error' });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    // validation du body de la requête
    const { email, password, rememberMe } = LoginSchema.parse(req.body) as LoginFormValues;
    // appelle auth service pour se connecter
    const { user, token, refreshToken } = await login(email, password, rememberMe);

    // mise en place des cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: convertInMs(process.env.JWT_EXPIRES_IN as string),
      path: '/api',
    });
    res.cookie('refreshtoken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: convertInMs(process.env.REFRESH_TOKEN_EXPIRES_IN as string),
      path: '/api/auth',
    });

    // creation d'une constante newuser contenant les information de user sans le password
    const newuser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    //response au frontend de la reussite de la connexion
    return res.status(200).json({ success: true, message: 'Login successful', data: newuser });
  } catch (error) {
    // Gestion des erreurs
    if (error instanceof Error) {
      console.error('Login error:', error.message);
      if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ success: false, message: 'Invalid User or Email' });
      }
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

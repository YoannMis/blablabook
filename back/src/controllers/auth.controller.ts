import type z from 'zod';
import AuthSchema from '../schema/auth.schema';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

//Typage Typescript
type AuthFormValues = z.infer<typeof AuthSchema>;

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
  } finally {
    // fermeture de la connexion prisma
    await prisma.$disconnect();
  }
};

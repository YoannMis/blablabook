// src/services/auth.service.ts
import { AuthSchema } from '../schema/auth.schema';
import { prisma } from '../utils/prisma.utils';
import * as argon2 from 'argon2';
import { convertInMs } from '../utils/time.utils';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

//Typage Typescript
type AuthFormValues = z.infer<typeof AuthSchema>;

export class AuthService {
  // Vérifie si l'utilisateur existe déjà
  static async userExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { email } });
    return !!user;
  }

  // Crée un nouvel utilisateur
  static async registerUser(data: AuthFormValues) {
    const { username, email, password } = data;

    // Vérification de l'existence de l'utilisateur
    if (await this.userExists(email)) {
      throw new Error('User or email already exists');
    }

    // Hachage du mot de passe
    const hashedPassword = await argon2.hash(password);

    // Création de l'utilisateur
    return prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
  }

  // Recherche un utilisateur par email
  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  // Vérifie le mot de passe de l'utilisateur
  static async verifyPassword(userPassword: string, inputPassword: string): Promise<boolean> {
    return argon2.verify(userPassword, inputPassword);
  }

  // Génère un token JWT
  static generateToken(payload: { id: number; username: string; email: string }): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN as string,
    });
  }

  // Génère un refresh token
  static generateRefreshToken(): { token: string; expiresAt: Date } {
    const token = crypto.randomBytes(128).toString('base64');
    const expiresAt = new Date(
      Date.now() + convertInMs(process.env.REFRESH_TOKEN_EXPIRES_IN as string)
    );
    return { token, expiresAt };
  }

  // Enregistre le refresh token en base de données
  // static async saveRefreshToken(userId: number, token: string, expiresAt: Date) {
  //   return prisma.refreshToken.create({
  //     data: {
  //       token,
  //       userId,
  //       issued_at: new Date(),
  //       expires_at: expiresAt,
  //     },
  //   });
  // }

  // Logique complète de login
  static async login(email: string, password: string) {
    //  Recherche de l'utilisateur
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Vérification du mot de passe
    const isPasswordValid = await this.verifyPassword(user.password, password);
    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Génération des tokens
    const token = this.generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });

    const { token: refreshToken, expiresAt } = this.generateRefreshToken();

    // Enregistrement du refresh token en base de données
    // await this.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: { id: user.id, username: user.username, email: user.email },
      token,
      refreshToken,
    };
  }
}

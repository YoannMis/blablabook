import { PrismaClient } from '../../generated/prisma';
// On réexporte tous les modèles pour faciliter leur utilisatation dans le reste de l'application
export * from '../../generated/prisma/client.ts';

export const prisma = new PrismaClient();

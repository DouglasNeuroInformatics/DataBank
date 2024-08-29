import { Prisma, PrismaClient } from '@prisma/client';

export type Model<T extends Prisma.ModelName> = PrismaClient[`${Uncapitalize<T>}`];

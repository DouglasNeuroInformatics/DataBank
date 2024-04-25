import type { Prisma } from '@prisma/client';

export const PRISMA_CLIENT_TOKEN = 'prisma';

export function getModelToken(modelName: Prisma.ModelName) {
  return PRISMA_CLIENT_TOKEN + modelName;
}

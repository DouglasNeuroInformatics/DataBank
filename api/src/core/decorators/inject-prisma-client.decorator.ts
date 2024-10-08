import { Inject } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { getModelToken, PRISMA_CLIENT_TOKEN } from '@/prisma/prisma.utils';

export const InjectPrismaClient = () => {
  return Inject(PRISMA_CLIENT_TOKEN);
};

export const InjectModel = (modelName: Prisma.ModelName) => {
  return Inject(getModelToken(modelName));
};

import { jest } from 'bun:test';

import type { Provider } from '@nestjs/common';
import type { Prisma } from '@prisma/client';


export function createMockModelProvider(modelName: Prisma.ModelName): Provider {
  return {
    provide: modelName,
    useValue: {
      aggregate: jest.fn(),
      aggregateRaw: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      exists: jest.fn(),
      fields: jest.fn(),
      findFirst: jest.fn(),
      findFirstOrThrow: jest.fn(),
      findMany: jest.fn(),
      findRaw: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      groupBy: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      upsert: jest.fn()
    }
  }
}

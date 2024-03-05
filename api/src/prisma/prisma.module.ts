import { type DynamicModule, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { PRISMA_CLIENT_TOKEN } from './prisma.utils.js';

@Module({})
export class PrismaModule {
  // static forFeature<T extends Prisma.ModelName>(modelName: T): DynamicModule {
  //     const modelToken =getModelToken(modelName)
  //     return {
  //       exports: [modelToken],
  //       module: PrismaModule,
  //       providers: [
  //         {
  //           inject: [PRISMA_CLIENT_TOKEN],
  //           provide: modelToken,
  //           useFactory: (client: PrismaClient) => {
  //             return client[modelName.toLowerCase() as Lowercase<T>];
  //           }
  //         }
  //       ]
  //     };
  //   }
  static forRoot(): DynamicModule {
    return {
      exports: [PRISMA_CLIENT_TOKEN],
      global: true,
      module: PrismaModule,
      providers: [{
        provide: PRISMA_CLIENT_TOKEN,
        useValue: new PrismaClient()
      }]
    }
  }
}

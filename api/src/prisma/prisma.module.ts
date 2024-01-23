import { type DynamicModule, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Module({})
export class PrismaModule {
    static forRoot(): DynamicModule {
        return {
            exports: ["prisma"],
            global: true,
            module: PrismaModule,
            providers: [{
                provide: "prisma",
                useValue: new PrismaClient()
            }]
        }
    }
}

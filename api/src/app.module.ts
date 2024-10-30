import { CryptoModule, LoggingModule } from '@douglasneuroinformatics/libnest/modules';
import { Module } from '@nestjs/common';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module.js';
import { ColumnsModule } from './columns/columns.module.js';
import { AcceptLanguageMiddleware } from './core/middleware/accept-language.middleware.js';
import { DatasetsModule } from './datasets/datasets.module.js';
import { I18nModule } from './i18n/i18n.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProjectsModule } from './projects/projects.module';
import { SetupModule } from './setup/setup.module.js';
import { TabularDataModule } from './tabular-data/tabular-data.module';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CryptoModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        secretKey: configService.getOrThrow('SECRET_KEY')
      })
    }),
    DatasetsModule,
    I18nModule,
    LoggingModule.forRoot({
      debug: true
    }),
    SetupModule,
    ThrottlerModule.forRoot([
      {
        limit: 100,
        ttl: 60000
      }
    ]),
    UsersModule,
    PrismaModule.forRoot(),
    ProjectsModule,
    ColumnsModule,
    TabularDataModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AcceptLanguageMiddleware).forRoutes('*');
  }
}

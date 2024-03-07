import { LoggerMiddleware } from '@douglasneuroinformatics/nestjs/core';
import { CryptoModule } from '@douglasneuroinformatics/nestjs/modules';
import { type MiddlewareConsumer, Module, type NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module.js';
import { AcceptLanguageMiddleware } from './core/middleware/accept-language.middleware.js';
import { DatasetsModule } from './datasets/datasets.module.js';
import { I18nModule } from './i18n/i18n.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SetupModule } from './setup/setup.module.js';
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
    SetupModule,
    ThrottlerModule.forRoot([
      {
        limit: 100,
        ttl: 60000
      }
    ]),
    UsersModule,
    PrismaModule.forRoot()
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AcceptLanguageMiddleware, LoggerMiddleware).forRoutes('*');
  }
}

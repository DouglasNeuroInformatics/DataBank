import { CryptoModule } from '@douglasneuroinformatics/nestjs/modules';
import { type MiddlewareConsumer, Module, type NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module.js';
import { AcceptLanguageMiddleware } from './core/middleware/accept-language.middleware.js';
import { LoggerMiddleware } from './core/middleware/logger.middleware.js';
import { DatasetsModule } from './datasets/datasets.module.js';
import { I18nModule } from './i18n/i18n.module.js';
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
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const env = configService.getOrThrow<string>('NODE_ENV');
        const mongoUri = configService.getOrThrow<string>('MONGO_URI');
        return {
          ignoreUndefined: true,
          uri: `${mongoUri}/databank-${env}`
        };
      }
    }),
    SetupModule,
    ThrottlerModule.forRoot([
      {
        limit: 100,
        ttl: 60000
      }
    ]),
    UsersModule
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

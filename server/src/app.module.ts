import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module.js';
import { GlobalExceptionFilter } from './core/filters/global-exception.filter.js';
import { AcceptLanguageMiddleware } from './core/middleware/accept-language.middleware.js';
import { LoggerMiddleware } from './core/middleware/logger.middleware.js';
import { I18nModule } from './i18n/i18n.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
    I18nModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const env = configService.getOrThrow<string>('NODE_ENV');
        const mongoUri = configService.getOrThrow<string>('MONGO_URI');
        return {
          ignoreUndefined: true,
          uri: `${mongoUri}/${env}`
        };
      }
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    }),
    UsersModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter
    },
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

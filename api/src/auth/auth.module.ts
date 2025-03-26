import { ConfigService, MailModule } from '@douglasneuroinformatics/libnest';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { I18nModule } from '@/i18n/i18n.module';
import { SetupModule } from '@/setup/setup.module';
import { UsersModule } from '@/users/users.module';

import { AuthController } from './auth.controller.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';

@Module({
  controllers: [AuthController],
  imports: [
    I18nModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.getOrThrow('SECRET_KEY')
      })
    }),
    MailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        auth: {
          password: configService.get('SMTP_AUTH_PASSWORD'),
          username: configService.get('SMTP_AUTH_USERNAME')
        },
        defaultSendOptions: {
          from: configService.get('SMTP_SENDER')
        },
        host: configService.get('SMTP_HOST'),
        port: configService.get('SMTP_PORT'),
        secure: configService.get('SMTP_SECURE')
      })
    }),
    UsersModule,
    SetupModule
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ]
})
export class AuthModule {}

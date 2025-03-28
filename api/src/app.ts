import { $BooleanLike, $NumberLike } from '@douglasneuroinformatics/libjs';
import { $BaseEnv, AppFactory } from '@douglasneuroinformatics/libnest';
import { Module } from '@nestjs/common';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { z } from 'zod';

import { AuthModule } from './auth/auth.module.js';
import { ColumnsModule } from './columns/columns.module.js';
import { AcceptLanguageMiddleware } from './core/middleware/accept-language.middleware.js';
import { DatasetsModule } from './datasets/datasets.module.js';
import { I18nModule } from './i18n/i18n.module.js';
import { ProjectsModule } from './projects/projects.module';
import { SetupModule } from './setup/setup.module.js';
import { TabularDataModule } from './tabular-data/tabular-data.module';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    AuthModule,
    ColumnsModule,
    DatasetsModule,
    I18nModule,
    ProjectsModule,
    SetupModule,
    TabularDataModule,
    UsersModule
  ]
})
class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AcceptLanguageMiddleware).forRoutes('*');
  }
}

export default AppFactory.create({
  docs: {
    contact: {
      email: 'support@douglasneuroinformatics.ca',
      name: 'Douglas Neuroinformatics',
      url: 'https://douglasneuroinformatics.ca'
    },
    description: 'Documentation for the REST API for the Douglas Data Bank',
    license: {
      name: 'AGPL-3.0',
      url: 'https://www.gnu.org/licenses/agpl-3.0.txt'
    },
    path: '/',
    title: 'Douglas Data Bank'
  },
  envSchema: $BaseEnv.extend({
    MAX_VALIDATION_ATTEMPTS: $NumberLike.pipe(z.number().positive().int()),
    SMTP_AUTH_PASSWORD: z.string().min(1),
    SMTP_AUTH_USERNAME: z.string().min(1),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: $NumberLike.pipe(z.union([z.literal(25), z.literal(465), z.literal(587)])),
    SMTP_SECURE: $BooleanLike,
    SMTP_SENDER: z.string().min(1).email(),
    VALIDATION_TIMEOUT: $NumberLike.pipe(z.number().positive().int())
  }),
  imports: [AppModule],
  prisma: {
    dbPrefix: 'data-bank'
  },
  version: '1'
});

import { acceptLanguage, AppFactory } from '@douglasneuroinformatics/libnest';
import { BullModule } from '@nestjs/bullmq';

import { AuthModule } from './auth/auth.module.js';
import { ColumnsModule } from './columns/columns.module.js';
import { $Env } from './core/env.schema.js';
import { DatasetsModule } from './datasets/datasets.module.js';
import { I18nModule } from './i18n/i18n.module.js';
import { ProjectsModule } from './projects/projects.module';
import { SetupModule } from './setup/setup.module.js';
import { TabularDataModule } from './tabular-data/tabular-data.module';
import { UsersModule } from './users/users.module.js';

export default AppFactory.create({
  configureMiddleware: (consumer) => {
    const middleware = acceptLanguage({ fallbackLanguage: 'en', supportedLanguages: ['en', 'fr'] });
    consumer.apply(middleware).forRoutes('*');
  },
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
  envSchema: $Env,
  imports: [
    AuthModule,
    ColumnsModule,
    DatasetsModule,
    I18nModule,
    ProjectsModule,
    SetupModule,
    TabularDataModule,
    UsersModule,
    BullModule.forRoot({
      connection: {
        host: process.env.VALKEY_HOST,
        port: parseInt(process.env.VALKEY_PORT!)
      }
    })
  ],
  prisma: {
    dbPrefix: 'data-bank'
  },
  version: '1'
});

import path from 'node:path';

import { ValidationPipe } from '@douglasneuroinformatics/libnest/core';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { type NestExpressApplication } from '@nestjs/platform-express';
import { json } from 'express';

import { AppModule } from './app.module.js';
import { setupDocs } from './docs.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose']
  });
  app.enableShutdownHooks();

  app.enableCors();
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI
  });
  app.use(json({ limit: '50MB' }));
  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(path.resolve(import.meta.dirname, '..', 'public'));
  setupDocs(app);

  const configService = app.get(ConfigService);

  const isProduction = configService.get<string>('NODE_ENV') === 'production';
  const port = isProduction ? 80 : parseInt(configService.getOrThrow('API_DEV_SERVER_PORT'));

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();

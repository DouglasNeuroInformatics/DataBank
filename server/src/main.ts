import path from 'node:path';
import url from 'node:url';

import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: ['error', 'warn', 'debug']
  });

  app.enableCors();
  app.enableVersioning({
    defaultVersion: '1',
    type: VersioningType.URI
  });

  app.useStaticAssets(path.resolve(__dirname, '..', 'public'));

  const config = new DocumentBuilder()
    .setTitle('The Douglas Data Bank')
    .setContact('Joshua Unrau', '', 'joshua.unrau@mail.mcgill.ca')
    .setDescription('Documentation for the Douglas Data Bank API')
    .setLicense('AGPL-3.0', 'https://www.gnu.org/licenses/agpl-3.0.txt')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api', app, document, {
    customCss: 'my custom css',
    customJs: '/main.js',
    customJsStr: 'console.log("hello")',
    customCssUrl: '/swagger.css',
    customfavIcon: '/favicon.ico',
    customSiteTitle: 'The Douglas Data Bank API',
    explorer: true
  });

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('SERVER_PORT');

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
// test(): ensure custom static assets are injected into html
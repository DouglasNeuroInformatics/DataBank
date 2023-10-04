import { type NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupDocs(app: NestExpressApplication) {
  const httpAdapter = app.getHttpAdapter().getInstance();

  const config = new DocumentBuilder()
    .setTitle('The Douglas Data Bank')
    .setContact('Joshua Unrau', '', 'joshua.unrau@mail.mcgill.ca')
    .setDescription('Documentation for the Douglas Data Bank API')
    .setLicense('AGPL-3.0', 'https://www.gnu.org/licenses/agpl-3.0.txt')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Users')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  httpAdapter.get('/spec.json', (_, res) => {
    res.send(document);
  });
}

// import { afterAll, beforeAll, describe, expect, it } from 'bun:test';

// // import { HttpStatus } from '@nestjs/common';
// import { type NestExpressApplication } from '@nestjs/platform-express';
// import { Test } from '@nestjs/testing';
// // import request from 'supertest';

// import { AppModule } from '@/app.module';
// import { AuthGuard } from '@/auth/auth.guard';

// describe('/app', () => {
//   let app: NestExpressApplication;
//   let server: unknown;

//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [AppModule]
//     })
//       .overrideGuard(AuthGuard)
//       .useValue(undefined)
//       .compile();

//     app = moduleRef.createNestApplication({
//       logger: false
//     });

//     await app.init();
//     server = app.getHttpServer();
//   });

//   it('should be defined', () => {
//     expect(app).toBeDefined();
//     expect(server).toBeDefined();
//   });

//   // describe('/users', () => {
//   //   describe('POST /users', () => {
//   //     it('should return status code 400 if an empty body is sent', async () => {
//   //       const response = await request(server).post('/users').send();
//   //       expect(response.status).toBe(HttpStatus.BAD_REQUEST);
//   //     });
//   //   });
//   // });

//   afterAll(async () => {
//     await app.close();
//   });
// });

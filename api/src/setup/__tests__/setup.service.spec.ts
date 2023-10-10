// // import { ConflictException, NotFoundException } from '@nestjs/common';
// import { beforeEach, describe, expect, it } from 'bun:test';

// import { getModelToken } from '@nestjs/mongoose';
// import { Test } from '@nestjs/testing';

// import { DatasetsService } from '@/datasets/datasets.service';
// import { UsersService } from '@/users/users.service';

// import { SetupConfig } from '../schemas/setup-config.schema';
// import { SetupController } from '../setup.controller';
// import { SetupService } from '../setup.service';

// describe('SetupService', () => {
//   let setupService: SetupService;

//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       controllers: [SetupController],
//       providers: [
//         SetupService,
//         DatasetsService,
//         UsersService,
//         {
//           provide: getModelToken(SetupConfig.name),
//           useValue: {}
//         }
//       ]
//     }).compile();
//     setupService = moduleRef.get(SetupService);
//   });

//   it('should be defined', () => {
//     expect(setupService).toBeDefined();
//   });

//   describe('isSetup',() => {
//     it('should return a boolean', () => {
//         expect()
//     })
//   });
// });

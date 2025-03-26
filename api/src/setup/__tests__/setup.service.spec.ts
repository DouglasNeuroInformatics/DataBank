import { getModelToken } from '@douglasneuroinformatics/libnest';
import type { Model } from '@douglasneuroinformatics/libnest';
import { MockFactory } from '@douglasneuroinformatics/libnest/testing';
import type { MockedInstance } from '@douglasneuroinformatics/libnest/testing';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { DatasetsService } from '@/datasets/datasets.service';
import { UsersService } from '@/users/users.service';

import { SetupService } from '../setup.service';

describe('SetupService', () => {
  let setupModel: MockedInstance<Model<'Setup'>>;
  let setupService: SetupService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        MockFactory.createForModelToken(getModelToken('Setup')),
        MockFactory.createForService(DatasetsService),
        MockFactory.createForService(UsersService),
        SetupService
      ]
    }).compile();
    setupModel = moduleRef.get(getModelToken('Setup'));
    setupService = moduleRef.get(SetupService);
  });

  describe('getState', () => {
    it('should return that the app is not setup if there are no items in the setup collection', async () => {
      setupModel.count.mockResolvedValueOnce(0);
      await expect(setupService.getState()).resolves.toStrictEqual({ isSetup: false });
    });
    it('should return that the app is setup if there are one or more items in the setup collection', async () => {
      setupModel.count.mockResolvedValueOnce(1);
      await expect(setupService.getState()).resolves.toStrictEqual({ isSetup: true });
    });
  });
});

// import type { AnyFunction } from 'bun';
// import { type Mock, beforeEach, describe, expect, it, jest } from 'bun:test';

// import { createMock } from '@douglasneuroinformatics/libnest/testing';
// import { NotFoundException } from '@nestjs/common';
// import { Test } from '@nestjs/testing';

// import { DatasetsService } from '@/datasets/datasets.service';
// import { UsersService } from '@/users/users.service';

// import { SetupConfig } from '../schemas/setup-config.schema.js';
// import { SetupController } from '../setup.controller.js';
// import { SetupService } from '../setup.service.js';

// describe('SetupService', () => {
//     let setupService: SetupService;
//     let setupConfigModel: {
//         create: Mock<AnyFunction>;
//         findOne: Mock<AnyFunction>;
//     };
//     let connection: {
//         collection: Mock<AnyFunction>;
//         db: {
//             listCollections: Mock<AnyFunction>;
//         };
//         dropDatabase: Mock<AnyFunction>;
//     };
//     beforeEach(async () => {
//         const moduleRef = await Test.createTestingModule({
//             controllers: [SetupController],
//             providers: [
//                 SetupService,
//                 {
//                     provide: getConnectionToken(),
//                     useValue: {
//                         collection: jest.fn(),
//                         db: {
//                             listCollections: jest.fn()
//                         },
//                         dropDatabase: jest.fn()
//                     }
//                 },
//                 {
//                     provide: DatasetsService,
//                     useValue: createMock(DatasetsService)
//                 },
//                 {
//                     provide: UsersService,
//                     useValue: createMock(UsersService)
//                 },
//                 {
//                     provide: getModelToken(SetupConfig.name),
//                     useValue: {
//                         create: jest.fn(),
//                         findOne: jest.fn()
//                     }
//                 }
//             ]
//         }).compile();
//         setupService = moduleRef.get(SetupService);
//         setupConfigModel = moduleRef.get(getModelToken(SetupConfig.name));
//         connection = moduleRef.get(getConnectionToken());
//     });

//     it('should be defined', () => {
//         expect(setupService).toBeDefined();
//     });

//     describe('getSetupConfig', () => {
//         it('should throw a not found exception if there is no setup config in the database', () => {
//             setupConfigModel.findOne.mockResolvedValueOnce(null);
//             expect(setupService.getSetupConfig()).rejects.toBeInstanceOf(NotFoundException);
//         });

//         it('should return the setup config object stored in the database', () => {
//             setupConfigModel.findOne.mockResolvedValueOnce({
//                 verificationInfo: {
//                     kind: 'ManualVerification'
//                 }
//             });
//             expect(setupService.getSetupConfig()).resolves.toEqual({
//                 verificationInfo: {
//                     kind: 'ManualVerification'
//                 }
//             });
//         });
//     });

//     describe('getVerificationInfo', () => {
//         it('should return the verification object stored in the database', () => {
//             setupConfigModel.findOne.mockResolvedValueOnce({
//                 verificationInfo: {
//                     kind: 'ManualVerification'
//                 }
//             });
//             expect(setupService.getVerificationInfo()).resolves.toEqual({
//                 kind: 'ManualVerification'
//             });
//         });
//     });

//     describe('getState', () => {
//         it('should return an object with isSetup being false if the db is empty', () => {
//             connection.db.listCollections.mockImplementationOnce(() => ({
//                 toArray: () => []
//             }));
//             expect(setupService.getState()).resolves.toEqual({
//                 isSetup: false
//             });
//         });

//         it('should return an object with isSetup being true if the db is not empty', () => {
//             connection.db.listCollections.mockImplementationOnce(() => ({
//                 toArray: () => [{ name: 'collection name' }]
//             }));
//             connection.collection.mockImplementationOnce(() => ({
//                 countDocuments: () => {
//                     return 1;
//                 }
//             }));
//             expect(setupService.getState()).resolves.toEqual({
//                 isSetup: true
//             });
//         });
//     });
// });

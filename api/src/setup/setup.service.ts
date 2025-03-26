import fs from 'node:fs/promises';
import path from 'node:path';

import type { Model } from '@douglasneuroinformatics/libnest';
import { InjectModel } from '@douglasneuroinformatics/libnest';
import { Injectable } from '@nestjs/common';
import { ForbiddenException, ServiceUnavailableException } from '@nestjs/common/exceptions';

import { DatasetsService } from '@/datasets/datasets.service.js';
import type { CreateTabularDatasetDto } from '@/datasets/zod/dataset';
import { UsersService } from '@/users/users.service.js';

import type { CreateAdminData, SetupOptions } from './setup.schemas.js';

@Injectable()
export class SetupService {
  constructor(
    @InjectModel('Setup') private readonly setupModel: Model<'Setup'>,
    private readonly datasetsService: DatasetsService,
    private readonly usersService: UsersService
  ) {}

  async getState() {
    return { isSetup: await this.isSetup() };
  }

  async getVerificationStrategy() {
    const setupConfig = await this.setupModel.findFirst({
      select: {
        verificationStrategy: true
      }
    });
    if (!setupConfig) {
      throw new ServiceUnavailableException('Application is not setup');
    }
    return setupConfig.verificationStrategy;
  }

  async initApp({ admin, setupConfig }: SetupOptions) {
    if (await this.isSetup()) {
      throw new ForbiddenException();
    }
    const user = await this.createAdmin(admin);

    await this.setupModel.create({
      data: {
        setupConfig: setupConfig
      }
    });

    const createStarterDatasetDto: CreateTabularDatasetDto = {
      datasetType: 'TABULAR',
      description: 'a sample dataset containing data about iris',
      isJSON: 'true',
      isReadyToShare: 'true',
      license: 'PUBLIC',
      managerIds: [user.id],
      name: 'iris',
      permission: 'PUBLIC',
      primaryKeys: ''
    };
    await this.datasetsService.createDataset(
      createStarterDatasetDto,
      await fs.readFile(path.resolve(import.meta.dirname, 'resources', 'iris.json'), 'utf-8'),
      user.id
    );
  }

  private async createAdmin(admin: CreateAdminData) {
    return this.usersService.createUser({
      ...admin,
      confirmedAt: new Date(Date.now()),
      datasetId: [],
      role: 'ADMIN',
      verifiedAt: new Date(Date.now())
    });
  }

  private async isSetup() {
    return (await this.setupModel.count({})) !== 0;
  }
}

import fs from 'node:fs/promises';
import path from 'node:path';

import type { CreateAdminData, SetupOptions, SetupState } from '@databank/core';
import type { Model } from '@douglasneuroinformatics/libnest';
import { InjectModel } from '@douglasneuroinformatics/libnest';
import { Injectable } from '@nestjs/common';
import { ConflictException, ServiceUnavailableException } from '@nestjs/common/exceptions';
import type { SetupConfig, User, UserVerificationStrategy } from '@prisma/client';

import { DatasetsService } from '@/datasets/datasets.service.js';
import type { CreateDatasetDto } from '@/datasets/dto/datasets.dto';
import { UsersService } from '@/users/users.service.js';

@Injectable()
export class SetupService {
  constructor(
    @InjectModel('SetupConfig') private readonly setupConfigModel: Model<'SetupConfig'>,
    private readonly datasetsService: DatasetsService,
    private readonly usersService: UsersService
  ) {}

  async getState(): Promise<SetupState> {
    return { isSetup: await this.isSetup() };
  }

  async getVerificationStrategy(): Promise<UserVerificationStrategy> {
    return this.getSetupConfig().then((config) => config.verificationStrategy);
  }

  async initApp({ admin, setupConfig }: SetupOptions): Promise<{ success: true }> {
    if (await this.isSetup()) {
      throw new ConflictException();
    }
    const adminUser = await this.createAdmin(admin);

    await this.setupConfigModel.create({
      data: setupConfig
    });

    const createStarterDatasetDto: CreateDatasetDto = {
      datasetType: 'TABULAR',
      description: 'a sample dataset containing data about iris',
      isJSON: 'true',
      isReadyToShare: 'true',
      license: 'PUBLIC',
      name: 'iris',
      permission: 'PUBLIC',
      primaryKeys: ''
    };

    await this.datasetsService.createDataset(
      createStarterDatasetDto,
      await fs.readFile(path.resolve(import.meta.dirname, 'resources', 'iris.json'), 'utf-8'),
      adminUser.id
    );

    return { success: true };
  }

  private async createAdmin(admin: CreateAdminData): Promise<Omit<User, 'hashedPassword'>> {
    return this.usersService.createUser({
      ...admin,
      confirmedAt: new Date(Date.now()),
      datasetId: [],
      role: 'ADMIN',
      verifiedAt: new Date(Date.now())
    });
  }

  private async getSetupConfig(): Promise<SetupConfig> {
    const setupConfig = await this.setupConfigModel.findFirst({});
    if (!setupConfig) {
      throw new ServiceUnavailableException('Application is not setup');
    }
    return setupConfig;
  }

  private async isSetup(): Promise<boolean> {
    return (await this.setupConfigModel.count({})) !== 0;
  }
}

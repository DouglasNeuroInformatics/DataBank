import fs from 'node:fs/promises';
import path from 'node:path';

import {
  $CreateAdminData,
  $CreateDataset,
  $SetupOptions,
  $SetupState,
  createDemoDatasetData,
  DEMO_USERS
} from '@databank/core';
import type { Model } from '@douglasneuroinformatics/libnest';
import { InjectModel } from '@douglasneuroinformatics/libnest';
import { Injectable } from '@nestjs/common';
import { ConflictException, ServiceUnavailableException } from '@nestjs/common/exceptions';
import type { SetupConfig, User, UserVerificationStrategy } from '@prisma/client';

import { DatasetsService } from '@/datasets/datasets.service.js';
import { UsersService } from '@/users/users.service.js';

@Injectable()
export class SetupService {
  constructor(
    @InjectModel('SetupConfig') private readonly setupConfigModel: Model<'SetupConfig'>,
    private readonly datasetsService: DatasetsService,
    private readonly usersService: UsersService
  ) {}

  async getState(): Promise<$SetupState> {
    return { isDemo: await this.isDemo(), isSetup: await this.isSetup() };
  }

  async getVerificationStrategy(): Promise<UserVerificationStrategy> {
    return this.getSetupConfig().then((config) => config.verificationStrategy);
  }

  async initApp({ admin, setupConfig }: $SetupOptions): Promise<{ success: true }> {
    if (await this.isSetup()) {
      throw new ConflictException();
    }
    const adminUser = await this.createAdmin(admin);

    await this.setupConfigModel.create({
      data: setupConfig
    });

    const createStarterDatasetDto: $CreateDataset = {
      datasetType: 'TABULAR',
      description: 'a sample dataset containing data about iris',
      isJSON: 'true',
      isReadyToShare: 'true',
      license: 'CC0-1.0',
      name: 'iris',
      permission: 'PUBLIC',
      primaryKeys: []
    };

    await this.datasetsService.createDataset(
      createStarterDatasetDto,
      await fs.readFile(path.resolve(import.meta.dirname, 'resources', 'iris.json'), 'utf-8'),
      adminUser.id
    );

    // setup for demo version: create demo users and demo dataset
    if (setupConfig.isDemo) {
      for (const user of DEMO_USERS) {
        const demoUser = await this.usersService.createUser({
          ...user,
          datasetIds: [...user.datasetIds]
        });

        if (user.isDataManager) {
          await this.datasetsService.createDataset(
            {
              ...createDemoDatasetData,
              primaryKeys: createDemoDatasetData.primaryKeys
            },
            await fs.readFile(path.resolve(import.meta.dirname, 'resources', 'demo-dataset.csv'), 'utf-8'),
            demoUser.id
          );
        }
      }
    }

    return { success: true };
  }

  private async createAdmin(admin: $CreateAdminData): Promise<Omit<User, 'hashedPassword'>> {
    return this.usersService.createUser({
      ...admin,
      confirmedAt: new Date(),
      datasetIds: [],
      role: 'ADMIN',
      verifiedAt: new Date()
    });
  }

  private async getSetupConfig(): Promise<SetupConfig> {
    const setupConfig = await this.setupConfigModel.findFirst();
    if (!setupConfig) {
      throw new ServiceUnavailableException('Application is not setup');
    }
    return setupConfig;
  }

  private async isDemo(): Promise<boolean> {
    const setupConfig = await this.setupConfigModel.findFirst();
    if (!setupConfig?.isDemo) {
      return false;
    }
    return true;
  }

  private async isSetup(): Promise<boolean> {
    return (await this.setupConfigModel.count()) !== 0;
  }
}

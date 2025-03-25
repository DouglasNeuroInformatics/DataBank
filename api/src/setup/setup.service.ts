import fs from 'node:fs/promises';
import path from 'node:path';

import type { Model } from '@douglasneuroinformatics/libnest';
import { InjectModel } from '@douglasneuroinformatics/libnest';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { DatasetsService } from '@/datasets/datasets.service.js';
import type { CreateTabularDatasetDto } from '@/datasets/zod/dataset';
import { UsersService } from '@/users/users.service.js';

import type { CreateAdminDto, SetupDto } from './zod/setup.js';

@Injectable()
export class SetupService {
  constructor(
    @InjectModel('Setup') private readonly setupModel: Model<'Setup'>,
    private readonly datasetsService: DatasetsService,
    private readonly usersService: UsersService
  ) {}

  async getSetupConfig() {
    const setup = await this.setupModel.findFirst({
      include: {
        setupConfig: {
          include: {
            userVerification: true
          }
        }
      }
    });
    if (!setup?.setupConfig) {
      throw new NotFoundException('Setup Config not found in the database.');
    }
    return setup.setupConfig;
  }

  async getState() {
    return { isSetup: await this.isSetup() };
  }

  async getVerificationInfo() {
    const setupConfig = await this.getSetupConfig();
    if (!setupConfig.userVerification) {
      throw new NotFoundException('Cannot access verification info.');
    }
    return setupConfig.userVerification;
  }

  async initApp({ admin, setupConfig }: SetupDto) {
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

  private async createAdmin(admin: CreateAdminDto) {
    return this.usersService.createUser({
      ...admin,
      confirmedAt: new Date(Date.now()),
      datasetId: [],
      role: 'ADMIN',
      verifiedAt: new Date(Date.now())
    });
  }

  private async isSetup() {
    const setupConfig = await this.setupModel.findMany();
    return setupConfig.length == 0 ? false : true;
  }

  // private async updateSetupConfig(setupConfigDto: SetupConfigDto) {
  //   const setupConfig = await this.setupConfigModel.findOne();
  //   if (!setupConfig) { throw new NotFoundException('Setup Config not found in the database.')}
  //   setupConfig.verificationInfo = setupConfigDto.verificationInfo;
  //   setupConfig.save();
  // }
}

import fs from 'node:fs/promises';
import path from 'node:path';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@/core/decorators/inject-prisma-client.decorator';
import { DatasetsService } from '@/datasets/datasets.service.js';
import type { CreateTabularDatasetDto } from '@/datasets/zod/dataset';
import type { Model } from '@/prisma/prisma.types.js';
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
    const setupConfig = await this.setupModel.findMany();
    if (!setupConfig) {
      throw new NotFoundException('Setup Config not found in the database.');
    }
    return setupConfig;
  }

  async getState() {
    return { isSetup: await this.isSetup() };
  }

  async getVerificationInfo() {
    const setupConfig = await this.getSetupConfig();
    if (!setupConfig[0]?.userVerification) {
      throw new NotFoundException('Cannot access verification info.');
    }
    return setupConfig[0]?.userVerification;
  }

  async initApp({ admin, setupConfig }: SetupDto) {
    if (await this.isSetup()) {
      throw new ForbiddenException();
    }
    const user = await this.createAdmin(admin);

    await this.setupModel.create({
      data: {
        userVerification: setupConfig.userVerification
      }
    });

    const createStarterDatasetDto: CreateTabularDatasetDto = {
      datasetType: 'TABULAR',
      description: 'a sample dataset containing data about iris',
      license: 'PUBLIC',
      managerIds: [user.id],
      name: 'iris',
      primaryKeys: []
    };
    await this.datasetsService.createDataset(
      createStarterDatasetDto,
      await fs.readFile(path.resolve(import.meta.dir, 'resources', 'iris.json'), 'utf-8'),
      user.id
    );
  }

  private async createAdmin(admin: CreateAdminDto) {
    return this.usersService.createUser({
      ...admin,
      confirmedAt: new Date(Date.now()),
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

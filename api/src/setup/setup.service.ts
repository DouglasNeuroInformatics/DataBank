import fs from 'node:fs/promises';
import path from 'node:path';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import type { Setup } from '@prisma/client';
import type { Model } from 'mongoose';

import { InjectModel } from '@/core/decorators/inject-prisma-client.decorator';
import { DatasetsService } from '@/datasets/datasets.service.js';
import { UsersService } from '@/users/users.service.js';

import type { CreateAdminDto, SetupDto } from './zod/setup';

@Injectable()
export class SetupService {
  constructor(
    @InjectModel('Setup') private readonly setupModel: Model<Setup>,
    private readonly datasetsService: DatasetsService,
    private readonly usersService: UsersService
  ) { }

  async getSetupConfig() {
    const setupConfig = await this.setupModel.findOne();
    if (!setupConfig) {
      throw new NotFoundException('Setup Config not found in the database.');
    }
    return setupConfig;
  }

  async getState() {
    return { isSetup: await this.isSetup() };
  }

  async getVerificationInfo() {
    const verificationInfo = await this.setupModel.findOne();
    if (!verificationInfo) {
      throw new NotFoundException('Cannot access verification info.');
    }
    return verificationInfo;
  }

  async initApp({ admin, setupConfig }: SetupDto) {
    if (await this.isSetup()) {
      throw new ForbiddenException();
    }
    const user = await this.createAdmin(admin);

    await this.setupModel.create({
      adminId: user.id,
      userVerification: setupConfig
    });

    const iris = await this.loadStarterDataset('iris.json');
    await this.datasetsService.create(iris, user.id);
  }

  private async createAdmin(admin: CreateAdminDto) {
    return this.usersService.createUser({
      ...admin,
      confirmedAt: new Date(Date.now()),
      role: 'ADMIN',
      verifiedAt: new Date(Date.now())
    });
  }

  private async isSetup() {
    const setup = await this.setupModel.findOne();
    if (!setup) {
      return false;
    }
    return true;
  }

  // private async updateSetupConfig(setupConfigDto: SetupConfigDto) {
  //   const setupConfig = await this.setupConfigModel.findOne();
  //   if (!setupConfig) { throw new NotFoundException('Setup Config not found in the database.')}
  //   setupConfig.verificationInfo = setupConfigDto.verificationInfo;
  //   setupConfig.save();
  // }

  private async loadStarterDataset(filename: string) {
    // NEED TO REWRITE
    const content = await fs.readFile(path.resolve(import.meta.dir, 'resources', filename), 'utf-8');
    return JSON.parse(content) as TDataset;
  }
}

import fs from 'node:fs/promises';
import path from 'node:path';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import type { Setup } from '@prisma/client';
import mongoose, { Model } from 'mongoose';

import { InjectPrismaClient } from '@/core/decorators/inject-prisma-client.decorator';
import { DatasetsService } from '@/datasets/datasets.service.js';
import { UsersService } from '@/users/users.service.js';

@Injectable()
export class SetupService {
  constructor(
    @InjectPrismaClient() private readonly setupModel: Model<Setup>,
    @InjectConnection() private readonly connection: mongoose.Connection,
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
    const verificationInfo = (await this.getSetupConfig()).verificationInfo;
    if (!verificationInfo) {
      throw new NotFoundException('Cannot access verification info.');
    }
    return verificationInfo;
  }

  async initApp({ admin, setupConfig }) {
    console.log(setupConfig);
    if (await this.isSetup()) {
      throw new ForbiddenException();
    }
    await this.connection.dropDatabase();
    const user = await this.createAdmin(admin);

    await this.setupConfigModel.create(setupConfig);

    const iris = await this.loadStarterDataset('iris.json');
    await this.datasetsService.createDataset(iris, user.toObject());
  }

  private async createAdmin(admin: CreateAdminDto) {
    return this.usersService.createUser({
      ...admin,
      confirmedAt: Date.now(),
      role: 'admin',
      verifiedAt: Date.now()
    });
  }

  private async isSetup() {
    const collections = await this.connection.db.listCollections().toArray();
    for (const collection of collections) {
      const count = await this.connection.collection(collection.name).countDocuments();
      if (count > 0) {
        return true;
      }
    }
    return false;
  }

  // private async updateSetupConfig(setupConfigDto: SetupConfigDto) {
  //   const setupConfig = await this.setupConfigModel.findOne();
  //   if (!setupConfig) { throw new NotFoundException('Setup Config not found in the database.')}
  //   setupConfig.verificationInfo = setupConfigDto.verificationInfo;
  //   setupConfig.save();
  // }

  private async loadStarterDataset(filename: string) {
    const content = await fs.readFile(path.resolve(import.meta.dir, 'resources', filename), 'utf-8');
    return JSON.parse(content) as TDataset;
  }
}

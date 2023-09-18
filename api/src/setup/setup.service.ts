import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { SetupState, TDataset } from '@databank/types';
import mongoose, { Model } from 'mongoose';

import { CreateAdminDto, SetupDto } from './dto/setup.dto.js';

import { DatasetsService } from '@/datasets/datasets.service.js';
import { UsersService } from '@/users/users.service.js';
import { SetupConfig } from './schemas/setup-config.schema.js';
import { SetupConfigDto } from './dto/setup-config.dto.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@Injectable()
export class SetupService {
  constructor(
    @InjectModel(SetupConfig.name) private readonly setupConfigModel: Model<SetupConfig>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly datasetsService: DatasetsService,
    private readonly usersService: UsersService
  ) {}

  async initApp({ admin, setupConfig }: SetupDto) {
    if (await this.isSetup()) {
      throw new ForbiddenException();
    }
    await this.connection.dropDatabase();
    const user = await this.createAdmin(admin);

    const config = new this.setupConfigModel(setupConfig);
    config.save();

    const iris = await this.loadStarterDataset('iris.json');
    await this.datasetsService.createDataset(iris, user.toObject());
  }

  async getState(): Promise<SetupState> {
    return { isSetup: await this.isSetup() };
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

  private async createAdmin(admin: CreateAdminDto) {
    return this.usersService.createUser({ ...admin, verifiedAt: Date.now(), role: 'admin' });
  }

  private async loadStarterDataset(filename: string) {
    const content = await fs.readFile(path.resolve(__dirname, 'resources', filename), 'utf-8');
    return JSON.parse(content) as TDataset;
  }

  async getSetupConfig() {
    const setupConfig = await this.setupConfigModel.findOne();
    if (!setupConfig) { throw new NotFoundException('Setup Config not found in the database.')}
    return setupConfig;
  }

  private async updateSetupConfig(setupConfigDto: SetupConfigDto) {
    const setupConfig = await this.setupConfigModel.findOne();
    if (!setupConfig) { throw new NotFoundException('Setup Config not found in the database.')}
    setupConfig.verificationInfo = setupConfigDto.verificationInfo;
    setupConfig.save();
  }

  async getVerificationInfo() {
    const verificationInfo = (await this.getSetupConfig()).verificationInfo;
    if (!verificationInfo) { 
      throw new NotFoundException('Cannot access verification info.')
    }
    return verificationInfo;
  }
}

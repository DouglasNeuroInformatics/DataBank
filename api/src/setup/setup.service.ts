import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

import { SetupState, TDataset } from '@databank/types';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { DatasetsService } from '@/datasets/datasets.service.js';
import { UsersService } from '@/users/users.service.js';

import { CreateAdminDto, SetupDto } from './dto/setup.dto.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@Injectable()
export class SetupService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly datasetsService: DatasetsService,
    private readonly usersService: UsersService
  ) {}

  private async createAdmin(admin: CreateAdminDto) {
    return this.usersService.createUser({ ...admin, isVerified: true, role: 'admin' });
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

  private async loadStarterDataset(filename: string) {
    const content = await fs.readFile(path.resolve(__dirname, 'resources', filename), 'utf-8');
    return JSON.parse(content) as TDataset;
  }

  async getState(): Promise<SetupState> {
    return { isSetup: await this.isSetup() };
  }

  async initApp({ admin }: SetupDto) {
    if (await this.isSetup()) {
      throw new ForbiddenException();
    }
    await this.connection.dropDatabase();
    const user = await this.createAdmin(admin);

    const iris = await this.loadStarterDataset('iris.json');
    await this.datasetsService.createDataset(iris, user.toObject());
  }
}

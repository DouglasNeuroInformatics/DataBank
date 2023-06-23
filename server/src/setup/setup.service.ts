import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import { DatasetColumn } from '@databank/types';
import mongoose from 'mongoose';

import { CreateAdminDto, SetupDto } from './dto/setup.dto.js';

import { DatasetsService } from '@/datasets/datasets.service.js';
import { UsersService } from '@/users/users.service.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

@Injectable()
export class SetupService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly datasetsService: DatasetsService,
    private readonly usersService: UsersService
  ) {}

  async initApp({ admin }: SetupDto) {
    // if (await this.isInitialized()) {
    //   throw new ForbiddenException();
    // }
    await this.connection.dropDatabase();
    const user = await this.createAdmin(admin);

    const iris = await this.loadStarterDataset('iris.json');

    await this.datasetsService.createDataset(
      {
        name: 'Iris',
        description: 'The iris dataset is a classic and very easy multi-class classification dataset',
        license: 'Public Domain',
        columns: iris.columns,
        data: iris.data
      },
      user.toObject()
    );
  }

  private async isInitialized() {
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
    return this.usersService.createUser({ ...admin, isVerified: true, role: 'admin' });
  }

  private async loadStarterDataset(filename: string) {
    const content = await fs.readFile(path.resolve(__dirname, 'resources', filename), 'utf-8');
    return JSON.parse(content) as {
      columns: Record<string, DatasetColumn>;
      data: Record<string, any>;
    };
  }
}

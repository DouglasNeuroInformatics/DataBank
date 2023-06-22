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
    await this.createAdmin(admin);
    await this.createIris();
    // await this.createBreastCancer();
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
    await this.usersService.createUser({ ...admin, isVerified: true, role: 'admin' });
  }

  private async createIris() {
    const iris = await this.loadResource<{
      columns: Record<string, DatasetColumn>;
      data: Record<string, any>;
    }>('iris.json');
    await this.datasetsService.createDataset({
      name: 'Iris',
      description: 'The iris dataset is a classic and very easy multi-class classification dataset',
      license: 'Public Domain',
      columns: iris.columns,
      data: iris.data
    });
  }

  // private async createBreastCancer() {
  //   await this.datasetsService.createDataset({
  //     name: 'Wisconsin Breast Cancer',
  //     description:
  //       'Features are computed from a digitized image of a fine needle aspirate (FNA) of a breast mass. They describe characteristics of the cell nuclei present in the image.',
  //     license: 'CC BY-NC-SA 4.0'
  //   });
  // }

  private async loadResource<T = any>(filename: string) {
    const content = await fs.readFile(path.resolve(__dirname, 'resources', filename), 'utf-8');
    return JSON.parse(content) as T;
  }
}

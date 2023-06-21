import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import mongoose from 'mongoose';

import { CreateAdminDto, SetupDto } from './dto/setup.dto.js';

import { DatasetsService } from '@/datasets/datasets.service.js';
import { UsersService } from '@/users/users.service.js';

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
    await this.datasetsService.createDataset({
      name: 'Iris',
      description:
        "The Iris flower data set or Fisher's Iris data set is a multivariate data set used and made famous by the British statistician and biologist Ronald Fisher in his 1936 paper The use of multiple measurements in taxonomic problems as an example of linear discriminant analysis.",
      license: 'Public Domain'
    });
  }
}

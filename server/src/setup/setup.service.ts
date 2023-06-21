import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import mongoose from 'mongoose';

import { SetupDto } from './dto/setup.dto.js';

import { UsersService } from '@/users/users.service.js';

@Injectable()
export class SetupService {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly usersService: UsersService
  ) {}

  async initApp({ admin }: SetupDto) {
    if (await this.isInitialized()) {
      throw new ForbiddenException();
    }
    await this.usersService.createUser({ ...admin, isVerified: true, role: 'admin' });
  }

  async isInitialized() {
    const collections = await this.connection.db.listCollections().toArray();
    for (const collection of collections) {
      const count = await this.connection.collection(collection.name).countDocuments();
      if (count > 0) {
        return true;
      }
    }
    return false;
  }
}

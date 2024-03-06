import { CryptoService } from '@douglasneuroinformatics/nestjs/modules';
import { ConflictException, Injectable } from '@nestjs/common';
import { type ConfirmEmailInfo, type User } from '@prisma/client';
import type { SetOptional } from 'type-fest';

import { InjectModel } from '@/core/decorators/inject-prisma-client.decorator';
import type { Model } from '@/prisma/prisma.types';

import type { CreateUserDto } from './zod/user.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<'User'>,
    private readonly cryptoService: CryptoService
  ) {}

  /** Insert a new user into the database */
  async createUser({
    email,
    firstName,
    lastName,
    password,
    ...rest
  }: CreateUserDto): Promise<Omit<User, 'hashedPassword'>> {
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ConflictException(`User with the provided email already exists: ${email}`);
    }
    const hashedPassword = await this.cryptoService.hashPassword(password);
    const createdUser = await this.userModel.create({
      data: {
        email,
        firstName,
        hashedPassword,
        lastName,
        ...rest
      }
    });

    const returnedUser: SetOptional<User, 'hashedPassword'> = createdUser;
    delete returnedUser.hashedPassword;
    return returnedUser;
  }

  /** Return the user with the provided email, or null if no such user exists */
  findByEmail(email: string) {
    return this.userModel.findUnique({
      where: {
        email
      }
    });
  }

  /** Get all users in the database */
  getAll(): Promise<User[]> {
    return this.userModel.findMany();
  }

  async setVerified(email: string) {
    return await this.userModel.update({
      data: {
        verifiedAt: new Date()
      },
      where: {
        email
      }
    });
  }

  async updateConfirmEmailInfo(email: string, confirmEmailInfo: ConfirmEmailInfo | null) {
    return await this.userModel.update({
      data: {
        confirmEmailInfo
      },
      where: {
        email
      }
    });
  }
}

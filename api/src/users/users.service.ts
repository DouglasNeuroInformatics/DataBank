import { $CreateUser, $UpdateUser } from '@databank/core';
import { CryptoService, InjectModel } from '@douglasneuroinformatics/libnest';
import type { Model } from '@douglasneuroinformatics/libnest';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { ConfirmEmailInfo, User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<'User'>,
    private readonly cryptoService: CryptoService
  ) {}

  /** Insert a new user into the database */
  async createUser(input: $CreateUser): Promise<Omit<User, 'hashedPassword'>> {
    const { datasetId, email, firstName, lastName, password } = input;
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new ConflictException(`User with the provided email already exists: ${email}`);
    }
    const hashedPassword = await this.cryptoService.hashPassword(password);
    const createdUser = await this.userModel.create({
      data: {
        datasetId,
        email,
        firstName,
        hashedPassword,
        lastName
      }
    });

    const { hashedPassword: _hp, ...returnedUser } = createdUser;
    return returnedUser;
  }

  /** Return the user with the provided email, or null if no such user exists */
  async findByEmail(email: string) {
    const user = await this.userModel.findUnique({
      where: {
        email: email
      }
    });
    return user;
  }

  async findById(userId: string) {
    const user = await this.userModel.findUnique({
      where: {
        id: userId
      }
    });
    if (!user) {
      throw new NotFoundException('User with id ' + userId + ' is not found!');
    }
    return user;
  }

  async findManyByDatasetId(datasetId: string) {
    const users = await this.userModel.findMany({
      where: {
        datasetId: {
          has: datasetId
        }
      }
    });
    return users;
  }

  /** Get all users in the database */
  async getAll(): Promise<User[]> {
    return await this.userModel.findMany();
  }

  async isOwnerOfDatasets(userId: string) {
    const user = await this.findById(userId);
    return user.datasetId.length > 0 ? true : false;
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

  updateUser(userId: string, updateUserData: $UpdateUser) {
    return this.userModel.update({
      data: updateUserData,
      where: {
        id: userId
      }
    });
  }
}

import { CryptoService } from '@douglasneuroinformatics/nestjs/modules';
import { ConflictException, Injectable } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';
import type { User } from '@prisma/client';
import type { SetOptional } from 'type-fest';

import { InjectPrismaClient } from '@/core/decorators/inject-prisma-client.decorator';

import type { CreateUserDto } from './schemas/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectPrismaClient() private readonly prisma: PrismaClient,
    private readonly cryptoService: CryptoService
  ) { }

  /** Insert a new user into the database */
  async createUser({ email, firstName, lastName, password, ...rest }: CreateUserDto): Promise<Omit<User, 'hashedPassword'>> {
    const user_exists = await this.findByEmail(email);
    if (user_exists) {
      throw new ConflictException(`User with the provided email already exists: ${email}`);
    }
    const hashedPassword = await this.cryptoService.hashPassword(password);
    const createdUser = await this.prisma.user.create({
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
    return this.prisma.user.findUnique({
      where: {
        email: email
      }
    });
  }

  /** Get all users in the database */
  getAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}

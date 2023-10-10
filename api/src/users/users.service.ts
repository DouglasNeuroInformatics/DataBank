import { CryptoService } from '@douglasneuroinformatics/nestjs/modules';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { SetOptional } from 'type-fest';

import { CreateUserDto } from './dto/create-user.dto';
import { User, type UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly cryptoService: CryptoService
  ) {}

  /** Insert a new user into the database */
  async createUser({ email, password, ...rest }: CreateUserDto): Promise<Omit<UserDocument, 'hashedPassword'>> {
    const exists = await this.userModel.exists({ email });
    if (exists) {
      throw new ConflictException(`User with provided email already exists: ${email}`);
    }
    const hashedPassword = await this.cryptoService.hashPassword(password);
    const createdUser = await this.userModel.create({
      email,
      hashedPassword,
      ...rest
    });

    const returnedUser: SetOptional<UserDocument, 'hashedPassword'> = createdUser;
    delete returnedUser.hashedPassword;
    return returnedUser;
  }

  /** Return the user with the provided email, or null if no such user exists */
  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  /** Get all users in the database */
  getAll() {
    return this.userModel.find();
  }
}

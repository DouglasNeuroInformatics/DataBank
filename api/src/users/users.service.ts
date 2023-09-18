import { CryptoService } from '@douglasneuroinformatics/nestjs/modules';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly cryptoService: CryptoService
  ) {}

  /** Insert a new user into the database */
  async createUser({ email, password, isVerified, verifiedAt,...rest }: CreateUserDto) {
    const exists = await this.userModel.exists({ email });
    if (exists) {
      throw new ConflictException(`User with provided email already exists: ${email}`);
    }
    const hashedPassword = await this.cryptoService.hashPassword(password);
    return this.userModel.create({
      email,
      hashedPassword,
      verifiedAt,
      ...rest
    });
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

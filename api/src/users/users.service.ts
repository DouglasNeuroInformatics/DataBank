import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto.js';
import { User } from './schemas/user.schema.js';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /** Insert a new user into the database */
  async createUser({ email, password, ...rest }: CreateUserDto) {
    const exists = await this.userModel.exists({ email });
    if (exists) {
      throw new ConflictException(`User with provided email already exists: ${email}`);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userModel.create({
      email,
      hashedPassword,
      creationTime : Date.now(),
      ...rest
    });
  }

  /** Get all users in the database */
  getAll() {
    return this.userModel.find();
  }

  /** Return the user with the provided email, or null if no such user exists */
  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}

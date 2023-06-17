import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CurrentUser } from '@databank/types';
import bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service.js';

import { CreateAccountDto } from './dto/create-account.dto.js';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User with the provided email not found: ' + email);
    }

    const isCorrectPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payload: CurrentUser = {
      email,
      role: user.role,
      isVerified: user.isVerified
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  /** Create a new standard account with verification required */
  async createAccount(createAccountDto: CreateAccountDto): Promise<CurrentUser> {
    return this.usersService.createUser({ ...createAccountDto, role: 'standard', isVerified: false });
  }

  async sendVerificationCode(user: CurrentUser) {
    return { expires: 3600 };
  }
}

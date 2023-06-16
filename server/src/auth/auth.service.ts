import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from '@app/types';
import bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service.js';

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

    const payload: JwtPayload = {
      email,
      role: user.role
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}

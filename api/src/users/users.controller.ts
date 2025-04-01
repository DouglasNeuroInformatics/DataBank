import type { CreateUser } from '@databank/core';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RouteAccess } from '@/core/decorators/route-access.decorator.js';

import { UsersService } from './users.service.js';

@ApiTags('Users')
@Controller({ path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    description:
      'Create a user with any permission level without requiring email confirmation, manually setting their verification status.',
    summary: 'Create User'
  })
  @Post()
  @RouteAccess({ role: 'STANDARD' })
  createUser(@Body() createUserDto: CreateUser) {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Find User by Email' })
  @Get('/email/:email')
  @RouteAccess({ role: 'STANDARD' })
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Find User by Id' })
  @Get(':id')
  @RouteAccess({ role: 'STANDARD' })
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Get Users' })
  @Get()
  @RouteAccess({ role: 'STANDARD' })
  getAll() {
    return this.usersService.getAll();
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller({ path: 'users' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create User',
    description: 'Create a user with any permission level without requiring email confirmation, manually setting their verification status.'
  })
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: 'Find User by Email' })
  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Get Users' })
  @Get()
  getAll() {
    return this.usersService.getAll();
  }
}

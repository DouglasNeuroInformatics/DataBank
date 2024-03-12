import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  imports: [PrismaModule.forFeature('User')],
  providers: [UsersService]
})
export class UsersModule {}

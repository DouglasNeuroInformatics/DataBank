import { Module } from '@nestjs/common';

import { DatasetsModule } from '@/datasets/datasets.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';

import { SetupController } from './setup.controller.js';
import { SetupService } from './setup.service.js';

@Module({
  controllers: [SetupController],
  exports: [SetupService],
  imports: [DatasetsModule, PrismaModule.forFeature('Setup'), UsersModule],
  providers: [SetupService]
})
export class SetupModule {}

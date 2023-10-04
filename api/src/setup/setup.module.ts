import { Module } from '@nestjs/common';

import { DatasetsModule } from '@/datasets/datasets.module.js';
import { UsersModule } from '@/users/users.module.js';

import { SetupController } from './setup.controller.js';
import { SetupService } from './setup.service.js';

@Module({
  controllers: [SetupController],
  imports: [DatasetsModule, UsersModule],
  providers: [SetupService]
})
export class SetupModule {}

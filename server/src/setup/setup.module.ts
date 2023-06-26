import { Module } from '@nestjs/common';

import { SetupController } from './setup.controller.js';
import { SetupService } from './setup.service.js';

import { DatasetsModule } from '@/datasets/datasets.module.js';
import { UsersModule } from '@/users/users.module.js';

@Module({
  imports: [DatasetsModule, UsersModule],
  controllers: [SetupController],
  providers: [SetupService]
})
export class SetupModule {}

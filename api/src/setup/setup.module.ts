import { Module } from '@nestjs/common';

import { SetupController } from './setup.controller.js';
import { SetupService } from './setup.service.js';

import { DatasetsModule } from '@/datasets/datasets.module.js';
import { UsersModule } from '@/users/users.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { SetupConfig, SetupConfigSchema } from './schemas/setup-config.schema.js';

@Module({
  imports: [DatasetsModule, UsersModule,
  MongooseModule.forFeature([
    {
      name: SetupConfig.name,
      schema: SetupConfigSchema
    }
  ])],
  controllers: [SetupController],
  providers: [SetupService],
  exports: [SetupService]
})
export class SetupModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DatasetsModule } from '@/datasets/datasets.module';
import { UsersModule } from '@/users/users.module';

import { SetupConfig, SetupConfigSchema } from './schemas/setup-config.schema.js';
import { SetupController } from './setup.controller.js';
import { SetupService } from './setup.service.js';

@Module({
  controllers: [SetupController],
  exports: [SetupService],
  imports: [DatasetsModule, UsersModule,
  MongooseModule.forFeature([
    {
      name: SetupConfig.name,
      schema: SetupConfigSchema
    }
  ])],
  providers: [SetupService]
})
export class SetupModule {}

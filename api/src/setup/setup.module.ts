import { Module } from '@nestjs/common';

import { DatasetsModule } from '@/datasets/datasets.module';
import { UsersModule } from '@/users/users.module';

import { MongooseModule } from '@nestjs/mongoose';
import { SetupConfig, SetupConfigSchema } from './schemas/setup-config.schema.js';
import { SetupController } from './setup.controller.js';
import { SetupService } from './setup.service.js';

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

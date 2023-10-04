import { Module } from '@nestjs/common';

import { DatasetsModule } from '@/datasets/datasets.module';
import { UsersModule } from '@/users/users.module';

import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';

@Module({
  controllers: [SetupController],
  imports: [DatasetsModule, UsersModule],
  providers: [SetupService]
})
export class SetupModule {}

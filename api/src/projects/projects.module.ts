import { Module } from '@nestjs/common';

import { DatasetsModule } from '@/datasets/datasets.module';
import { UsersModule } from '@/users/users.module';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

@Module({
  controllers: [ProjectsController],
  imports: [UsersModule, DatasetsModule],
  providers: [ProjectsService]
})
export class ProjectsModule {}

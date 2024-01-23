import { Module } from '@nestjs/common';

import { DatasetsController } from './datasets.controller';
import { DatasetsService } from './datasets.service';

@Module({
  controllers: [DatasetsController],
  exports: [DatasetsService],
  imports: [],
  providers: [DatasetsService]
})
export class DatasetsModule { }

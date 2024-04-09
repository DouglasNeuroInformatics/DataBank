import { Module } from '@nestjs/common';

import { TabularDataController } from './tabular-data.controller';
import { TabularDataService } from './tabular-data.service';

@Module({
  controllers: [TabularDataController],
  providers: [TabularDataService]
})
export class TabularDataModule {}

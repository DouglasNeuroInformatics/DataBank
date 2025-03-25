import { Module } from '@nestjs/common';

import { ColumnsService } from './columns.service';

@Module({
  exports: [ColumnsService],
  providers: [ColumnsService]
})
export class ColumnsModule {}

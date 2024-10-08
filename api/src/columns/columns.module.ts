import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { PrismaModule } from '@/prisma/prisma.module';

import { ColumnsService } from './columns.service';

@Module({
  exports: [ColumnsService],
  imports: [PrismaModule.forFeature('TabularColumn'), PrismaClient],
  providers: [ColumnsService]
})
export class ColumnsModule {}

import { CurrentUser } from '@douglasneuroinformatics/libnest/core';
import { Controller, Delete, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RouteAccess } from '@/core/decorators/route-access.decorator';

import { ColumnsService } from './columns.service';

@ApiTags('Columns')
@Controller({ path: 'columns' })
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Delete(':id/:column')
  @RouteAccess({ role: 'STANDARD' })
  deleteById(@Param('column') columnId: string, @CurrentUser('id') currentUserId: string) {
    return this.columnsService.deleteById(columnId, currentUserId);
  }
}

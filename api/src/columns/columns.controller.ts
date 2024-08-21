import type { ColumnDataType } from '@databank/types';
import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { PermissionLevel } from '@prisma/client';

import { RouteAccess } from '@/core/decorators/route-access.decorator';

import { ColumnsService } from './columns.service';

@ApiTags('Columns')
@Controller({ path: 'columns' })
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Patch('/data-permission/:id')
  @RouteAccess({ role: 'STANDARD' })
  changeColumnDataPermission(
    @Param('id') columnId: string,
    @Body('newPermissionLevel') newPermissionLevel: PermissionLevel
  ) {
    return this.columnsService.changeColumnDataPermission(columnId, newPermissionLevel);
  }

  @Patch('/metadata-permission/:id')
  @RouteAccess({ role: 'STANDARD' })
  changeColumnMetadataPermission(
    @Param('id') columnId: string,
    @Body('newPermissionLevel') newPermissionLevel: PermissionLevel
  ) {
    return this.columnsService.changeColumnMetadataPermission(columnId, newPermissionLevel);
  }

  @Delete(':id')
  @RouteAccess({ role: 'STANDARD' })
  deleteById(@Param('id') columnId: string) {
    return this.columnsService.deleteById(columnId);
  }

  @Patch('/type/:id')
  @RouteAccess({ role: 'STANDARD' })
  mutateColumnType(@Param('id') columnId: string, @Body('type') columnType: ColumnDataType) {
    return this.columnsService.mutateColumnType(columnId, columnType);
  }

  @Patch('/nullable/:id')
  @RouteAccess({ role: 'STANDARD' })
  toggleColumnNullable(@Param('id') columnId: string) {
    return this.columnsService.toggleColumnNullable(columnId);
  }
}

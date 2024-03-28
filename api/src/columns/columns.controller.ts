import { Controller, Get } from '@nestjs/common';

import { ColumnsService } from './columns.service';

@Controller({ path: 'columns' })
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}
  @Get('/')
  hello() {
    return this.columnsService.hello();
  }
}

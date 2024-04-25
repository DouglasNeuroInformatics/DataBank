import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('TabularData')
@Controller('tabular-data')
export class TabularDataController {}

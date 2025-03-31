import { $DatasetViewPagination, type DatasetViewPagination } from '@databank/core';
import { DataTransferObject } from '@douglasneuroinformatics/libnest';

export class DatasetViewPaginationDto
  extends DataTransferObject($DatasetViewPagination)
  implements DatasetViewPagination {}

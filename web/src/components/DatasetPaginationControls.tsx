import type { $DatasetViewPagination } from '@databank/core';
import { Separator } from '@douglasneuroinformatics/libui/components';

import { DatasetPagination } from './DatasetPagination';

type DatasetPaginationControlsProps = {
  columnPagination: $DatasetViewPagination;
  rowPagination: $DatasetViewPagination;
  setColumnPagination: (pagination: $DatasetViewPagination) => void;
  setRowPagination: (pagination: $DatasetViewPagination) => void;
  totalNumberOfColumns: number;
  totalNumberOfRows: number;
};

export const DatasetPaginationControls = ({
  columnPagination,
  rowPagination,
  setColumnPagination,
  setRowPagination,
  totalNumberOfColumns,
  totalNumberOfRows
}: DatasetPaginationControlsProps) => {
  return (
    <div className="flex items-center gap-6">
      <DatasetPagination
        currentPage={columnPagination.currentPage}
        itemsPerPage={columnPagination.itemsPerPage}
        kind="COLUMN"
        setDatasetPagination={setColumnPagination}
        totalNumberOfItems={totalNumberOfColumns}
      />
      <Separator className="h-10" orientation="vertical" />
      <DatasetPagination
        currentPage={rowPagination.currentPage}
        itemsPerPage={rowPagination.itemsPerPage}
        kind="ROW"
        setDatasetPagination={setRowPagination}
        totalNumberOfItems={totalNumberOfRows}
      />
    </div>
  );
};

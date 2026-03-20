import { $DatasetViewPagination } from '@databank/core';
import { ActionDropdown, Button } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

type DatasetPaginationProps = {
  currentPage: number;
  itemsPerPage: number;
  kind: 'COLUMN' | 'ROW';
  setDatasetPagination: (newPaginationDto: $DatasetViewPagination) => void;
  totalNumberOfItems: number;
};

export const DatasetPagination = ({
  currentPage,
  itemsPerPage,
  kind,
  setDatasetPagination,
  totalNumberOfItems
}: DatasetPaginationProps) => {
  const { t } = useTranslation('common');
  const totalNumberOfPage = Math.ceil(totalNumberOfItems / itemsPerPage);

  const handleSelectPageOption = (option: string) => {
    const itemsPerPage = option === 'All' ? totalNumberOfItems : parseInt(option);
    setDatasetPagination({ currentPage: 1, itemsPerPage });
  };

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center justify-end gap-4">
        <ActionDropdown
          options={['10', '20', '50', '100', 'All']}
          title={(kind === 'COLUMN' ? t('columnsPerPage') : t('rowsPerPage')).concat(`: ${itemsPerPage}`)}
          onSelection={(options) => handleSelectPageOption(options)}
        />
        <p className="text-muted-foreground whitespace-nowrap text-sm tabular-nums">
          {kind === 'COLUMN' ? t({ en: 'Column ' }) : t({ en: 'Row ' })}
          {currentPage} / {totalNumberOfPage}
        </p>
        <div className="flex items-center gap-2">
          <Button
            disabled={currentPage === 1}
            size="icon"
            type="button"
            variant="outline"
            onClick={() => setDatasetPagination({ currentPage: currentPage - 1, itemsPerPage })}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            disabled={currentPage === totalNumberOfPage}
            size="icon"
            type="button"
            variant="outline"
            onClick={() => setDatasetPagination({ currentPage: currentPage + 1, itemsPerPage })}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

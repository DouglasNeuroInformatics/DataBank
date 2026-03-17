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

  const handleSelectPageOption = (options: string) => {
    switch (options) {
      case '10':
        setDatasetPagination({ currentPage: 1, itemsPerPage: 10 });
        break;
      case '20':
        setDatasetPagination({ currentPage: 1, itemsPerPage: 20 });
        break;
      case '50':
        setDatasetPagination({ currentPage: 1, itemsPerPage: 50 });
        break;
      case '100':
        setDatasetPagination({ currentPage: 1, itemsPerPage: 100 });
        break;
      case 'All':
        setDatasetPagination({ currentPage: 1, itemsPerPage: totalNumberOfItems });
        break;
    }
  };

  return (
    <div className="flex items-center justify-between border-t py-3">
      <p className="text-muted-foreground hidden text-sm sm:block">
        {kind === 'COLUMN' ? t('columnPagination') : t('rowPagination')}
      </p>
      <div className="flex flex-1 items-center justify-end gap-2">
        <ActionDropdown
          options={['10', '20', '50', '100', 'All']}
          title={(kind === 'COLUMN' ? t('columnsPerPage') : t('rowsPerPage')).concat(`: ${itemsPerPage}`)}
          onSelection={(options) => handleSelectPageOption(options)}
        />
        <p className="text-muted-foreground text-sm tabular-nums">
          {currentPage} / {totalNumberOfPage}
        </p>
        <Button
          disabled={currentPage === 1}
          size="sm"
          type="button"
          variant="outline"
          onClick={() => setDatasetPagination({ currentPage: currentPage - 1, itemsPerPage })}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
        <Button
          disabled={currentPage === totalNumberOfPage}
          size="sm"
          type="button"
          variant="outline"
          onClick={() => setDatasetPagination({ currentPage: currentPage + 1, itemsPerPage })}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

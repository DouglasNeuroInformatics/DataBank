import type { DatasetViewPagination } from '@databank/core';
import { ActionDropdown, Button } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';

type DatasetPagePaginationProps = {
  currentPage: number;
  itemsPerPage: number;
  kind: 'COLUMN' | 'ROW';
  setDatasetPagination: (newPaginationDto: DatasetViewPagination) => void;
  totalNumberOfItems: number;
};

export const DatasetPagination = ({
  currentPage,
  itemsPerPage,
  kind,
  setDatasetPagination,
  totalNumberOfItems
}: DatasetPagePaginationProps) => {
  const { t } = useTranslation('common');
  const totalNumberOfPage = Math.ceil(totalNumberOfItems / itemsPerPage);
  const title = kind === 'COLUMN' ? t('columnPagination') : t('rowPagination');
  const handleSelectPageOption = (options: string) => {
    switch (options) {
      case '10':
        setDatasetPagination({
          currentPage: 1,
          itemsPerPage: 10
        });
        break;
      case '20':
        setDatasetPagination({
          currentPage: 1,
          itemsPerPage: 20
        });
        break;
      case '50':
        setDatasetPagination({
          currentPage: 1,
          itemsPerPage: 50
        });
        break;
      case '100':
        setDatasetPagination({
          currentPage: 1,
          itemsPerPage: 100
        });
        break;
      case 'All':
        setDatasetPagination({
          currentPage: 1,
          itemsPerPage: totalNumberOfItems
        });
        break;
    }
  };

  return (
    <div className="flex items-center justify-between py-3">
      <div className="hidden sm:block">
        <p className="text-muted-foreground text-sm font-medium"></p>
      </div>
      <div className="flex flex-1 justify-between gap-5 sm:justify-center">
        <h1>{title}: </h1>
        <Button
          disabled={currentPage === 1}
          type="button"
          variant="outline"
          onClick={() => {
            setDatasetPagination({
              currentPage: currentPage - 1,
              itemsPerPage
            });
          }}
        >
          {t('paginationPrevious')}
        </Button>

        <div>
          <ActionDropdown
            options={['10', '20', '50', '100', 'All']}
            title={(kind === 'COLUMN' ? t('columnsPerPage') : t('rowsPerPage')).concat(`: ${itemsPerPage}`)}
            onSelection={(options) => handleSelectPageOption(options)}
          ></ActionDropdown>
        </div>

        <p>{`${currentPage} / total: ${totalNumberOfPage}`}</p>
        <Button
          disabled={currentPage === totalNumberOfPage}
          type="button"
          variant="outline"
          onClick={() => {
            setDatasetPagination({
              currentPage: currentPage + 1,
              itemsPerPage
            });
          }}
        >
          {t('paginationNext')}
        </Button>
      </div>
    </div>
  );
};

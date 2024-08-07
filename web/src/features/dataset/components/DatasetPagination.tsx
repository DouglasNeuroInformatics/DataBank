import { useState } from 'react';

import type { DatasetViewPaginationDto } from '@databank/types';
import { Button } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from 'react-i18next';

type DatasetPagePaginationProps = {
  datasetPaginationDto: DatasetViewPaginationDto;
  setDatasetPagination: (newPaginationDto: DatasetViewPaginationDto) => void;
};

export const DatasetPagination = (datasetPaginationProps: DatasetPagePaginationProps) => {
  const { t } = useTranslation('common');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex items-center justify-between py-3">
      <div className="hidden sm:block">
        <p className="text-sm font-medium text-muted-foreground"></p>
      </div>
      <div className="flex flex-1 justify-between gap-3 sm:justify-end">
        <Button
          disabled={currentPage === 1}
          type="button"
          variant="outline"
          onClick={() => {
            setCurrentPage(currentPage - 1);
          }}
        >
          {t('paginationPrevious')}
        </Button>
        <Button
          disabled={currentPage === datasetPaginationProps.datasetPaginationDto.currentPage}
          type="button"
          variant="outline"
          onClick={() => {
            setCurrentPage(currentPage + 1);
          }}
        >
          {t('paginationNext')}
        </Button>
      </div>
    </div>
  );
};

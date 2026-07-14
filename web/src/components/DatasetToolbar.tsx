import type { $DatasetViewPagination } from '@databank/core';
import { Button, DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { ColumnsIcon, DownloadIcon } from 'lucide-react';

const COLUMNS_PER_PAGE_OPTIONS = [10, 20, 50, 100] as const;

type DatasetToolbarProps = {
  columnPagination: $DatasetViewPagination;
  onDataDownload: (format: 'CSV' | 'TSV') => void;
  onMetadataDownload: (format: 'CSV' | 'TSV') => void;
  setColumnPagination: (pagination: $DatasetViewPagination) => void;
  totalNumberOfColumns: number;
};

/**
 * Actions for the dataset table. Rows are paginated by the table itself, but the API also
 * pages columns, so the visible column window is selected here rather than by a second paginator.
 */
export const DatasetToolbar = ({
  columnPagination,
  onDataDownload,
  onMetadataDownload,
  setColumnPagination,
  totalNumberOfColumns
}: DatasetToolbarProps) => {
  const { t } = useTranslation('common');

  const totalNumberOfPages = Math.ceil(totalNumberOfColumns / columnPagination.itemsPerPage);
  const visibleColumns = Math.min(columnPagination.itemsPerPage, totalNumberOfColumns);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button size="sm" variant="outline">
            <ColumnsIcon className="mr-1.5 size-3.5" />
            {t({
              en: `Columns: ${visibleColumns} of ${totalNumberOfColumns}`,
              fr: `Colonnes : ${visibleColumns} sur ${totalNumberOfColumns}`
            })}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Label>{t('columnsPerPage')}</DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={String(columnPagination.itemsPerPage)}
            onValueChange={(value) => setColumnPagination({ currentPage: 1, itemsPerPage: Number(value) })}
          >
            {COLUMNS_PER_PAGE_OPTIONS.map((option) => (
              <DropdownMenu.RadioItem key={option} value={String(option)}>
                {option}
              </DropdownMenu.RadioItem>
            ))}
            <DropdownMenu.RadioItem value={String(totalNumberOfColumns)}>
              {t({ en: 'All', fr: 'Toutes' })}
            </DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
          {totalNumberOfPages > 1 && (
            <>
              <DropdownMenu.Separator />
              <DropdownMenu.Label>
                {t({
                  en: `Showing group ${columnPagination.currentPage} of ${totalNumberOfPages}`,
                  fr: `Groupe ${columnPagination.currentPage} sur ${totalNumberOfPages}`
                })}
              </DropdownMenu.Label>
              <DropdownMenu.Group>
                <DropdownMenu.Item
                  disabled={columnPagination.currentPage === 1}
                  onClick={() =>
                    setColumnPagination({ ...columnPagination, currentPage: columnPagination.currentPage - 1 })
                  }
                >
                  {t({ en: 'Previous columns', fr: 'Colonnes précédentes' })}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  disabled={columnPagination.currentPage === totalNumberOfPages}
                  onClick={() =>
                    setColumnPagination({ ...columnPagination, currentPage: columnPagination.currentPage + 1 })
                  }
                >
                  {t({ en: 'Next columns', fr: 'Colonnes suivantes' })}
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button size="sm" variant="outline">
            <DownloadIcon className="mr-1.5 size-3.5" />
            {t({ en: 'Download', fr: 'Télécharger' })}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{t('downloadDataset')}</DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item onClick={() => onDataDownload('CSV')}>CSV</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => onDataDownload('TSV')}>TSV</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>{t('downloadMetadata')}</DropdownMenu.SubTrigger>
            <DropdownMenu.Portal>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item onClick={() => onMetadataDownload('CSV')}>CSV</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => onMetadataDownload('TSV')}>TSV</DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Portal>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};

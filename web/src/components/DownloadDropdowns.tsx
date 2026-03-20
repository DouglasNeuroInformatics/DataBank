import { Button, DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { DownloadIcon } from 'lucide-react';

type DownloadDropdownsProps = {
  onDataDownload: (format: 'CSV' | 'TSV') => void;
  onMetadataDownload: (format: 'CSV' | 'TSV') => void;
};

export const DownloadDropdowns = ({ onDataDownload, onMetadataDownload }: DownloadDropdownsProps) => {
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button size="sm" variant="outline">
            <DownloadIcon className="mr-1.5 size-3.5" />
            {t('downloadDataset')}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item onClick={() => onDataDownload('CSV')}>CSV</DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => onDataDownload('TSV')}>TSV</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button size="sm" variant="outline">
            <DownloadIcon className="mr-1.5 size-3.5" />
            {t('downloadMetadata')}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item onClick={() => onMetadataDownload('CSV')}>CSV</DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => onMetadataDownload('TSV')}>TSV</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
};

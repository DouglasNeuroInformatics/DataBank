/* eslint-disable perfectionist/sort-objects */
import { useEffect, useState } from 'react';

import { $DatasetViewPagination, licensesObjects } from '@databank/core';
import type { $TabularDataset } from '@databank/core';
import { Badge, Button, Card, DropdownMenu, Spinner } from '@douglasneuroinformatics/libui/components';
import {
  useDestructiveAction,
  useDownload,
  useNotificationsStore,
  useTranslation
} from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { ArrowLeftIcon, DownloadIcon, TrashIcon } from 'lucide-react';

import { DatasetPagination } from '@/components/DatasetPagination';
import { DatasetTable } from '@/components/DatasetTable';
import { PageHeading } from '@/components/PageHeading';
import { useAppStore } from '@/store';

const RouteComponent = () => {
  const { projectId, datasetId } = Route.useParams();
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const download = useDownload();
  const currentUser = useAppStore((s) => s.auth.ctx.currentUser);

  const [dataset, setDataset] = useState<$TabularDataset | null>(null);

  const [columnPaginationDto, setColumnPaginationDto] = useState<$DatasetViewPagination>({
    currentPage: 1,
    itemsPerPage: 10
  });

  const [rowPaginationDto, setRowPaginationDto] = useState<$DatasetViewPagination>({
    currentPage: 1,
    itemsPerPage: 10
  });

  useEffect(() => {
    axios
      .post<$TabularDataset>(`/v1/projects/dataset/${projectId}/${datasetId}`, {
        columnPaginationDto,
        rowPaginationDto
      })
      .then((response) => setDataset(response.data))
      .catch(console.error);
  }, [columnPaginationDto, rowPaginationDto, projectId, datasetId]);

  const isManager = Boolean(dataset?.managerIds.includes(currentUser!.id));

  const deleteDataset = useDestructiveAction(() => {
    axios
      .delete(`/v1/projects/remove-dataset/${projectId}/${datasetId}`)
      .then(() => {
        addNotification({
          type: 'success',
          message: `Dataset with Id ${datasetId} has been removed from the project`
        });
        void navigate({ to: '/portal/projects/$projectId', params: { projectId } });
      })
      .catch(console.error);
  });

  const handleDataDownload = async (format: 'CSV' | 'TSV') => {
    if (!dataset) return;
    const filename = dataset.name + '_' + new Date().toISOString() + '.' + format.toLowerCase();
    const response = await axios.get(`/v1/projects/download-data/${projectId}/${datasetId}/${format}`);
    void download(filename, response.data as string);
  };

  const handleMetaDataDownload = async (format: 'CSV' | 'TSV') => {
    if (!dataset) return;
    const filename = 'metadata_' + dataset.name + '_' + new Date().toISOString() + '.' + format.toLowerCase();
    const response = await axios.get(`/v1/projects/download-metadata/${projectId}/${datasetId}/${format}`);
    void download(filename, response.data as string);
  };

  if (!dataset) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const licenseInfo = licensesObjects[dataset.license];

  return (
    <div>
      <PageHeading
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void navigate({ to: '/portal/projects/$projectId', params: { projectId } })}
            >
              <ArrowLeftIcon className="mr-1.5 size-3.5" />
              {t({
                en: 'Back to Project',
                fr: 'Retour au projet'
              })}
            </Button>
            {isManager && (
              <Button size="sm" variant="danger" onClick={() => deleteDataset()}>
                <TrashIcon className="mr-1.5 size-3.5" />
                {t('deleteDataset')}
              </Button>
            )}
          </>
        }
        description={dataset.description ?? undefined}
      >
        {dataset.name}
      </PageHeading>

      <Card className="mb-6">
        <Card.Content className="pt-6">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{t('createdAt')}</dt>
              <dd className="mt-1 text-sm">{new Date(dataset.createdAt).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{t('updatedAt')}</dt>
              <dd className="mt-1 text-sm">{new Date(dataset.updatedAt).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                {t('datasetLicense')}
              </dt>
              <dd className="mt-1">
                <Badge title={licenseInfo?.name} variant="secondary">
                  {dataset.license}
                </Badge>
              </dd>
            </div>
          </dl>
        </Card.Content>
      </Card>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Data</h3>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button size="sm" variant="outline">
                  <DownloadIcon className="mr-1.5 size-3.5" />
                  {t('downloadDataset')}
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end">
                <DropdownMenu.Item onClick={() => void handleDataDownload('CSV')}>CSV</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => void handleDataDownload('TSV')}>TSV</DropdownMenu.Item>
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
                <DropdownMenu.Item onClick={() => void handleMetaDataDownload('CSV')}>CSV</DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => void handleMetaDataDownload('TSV')}>TSV</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        </div>
        <DatasetPagination
          currentPage={columnPaginationDto.currentPage}
          itemsPerPage={columnPaginationDto.itemsPerPage}
          kind="COLUMN"
          setDatasetPagination={setColumnPaginationDto}
          totalNumberOfItems={dataset.totalNumberOfColumns}
        />
        <div className="overflow-hidden rounded-md border">
          <DatasetTable isManager={false} isProject={true} {...dataset} />
        </div>
        <DatasetPagination
          currentPage={rowPaginationDto.currentPage}
          itemsPerPage={rowPaginationDto.itemsPerPage}
          kind="ROW"
          setDatasetPagination={setRowPaginationDto}
          totalNumberOfItems={dataset.totalNumberOfRows}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/portal/projects/$projectId/datasets/$datasetId/')({
  component: RouteComponent
});

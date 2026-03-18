/* eslint-disable perfectionist/sort-objects */

import { $DatasetViewPagination, licensesObjects } from '@databank/core';
import type { $DatasetViewPagination as DatasetViewPaginationType } from '@databank/core';
import { Badge, Button, Card } from '@douglasneuroinformatics/libui/components';
import {
  useDestructiveAction,
  useDownload,
  useNotificationsStore,
  useTranslation
} from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import axios from 'axios';
import { PencilIcon, TrashIcon, UsersIcon } from 'lucide-react';
import { z } from 'zod/v4';

import { DatasetPagination } from '@/components/DatasetPagination';
import { DatasetTable } from '@/components/DatasetTable';
import { DownloadDropdowns } from '@/components/DownloadDropdowns';
import { PageHeading } from '@/components/PageHeading';
import { datasetQueryOptions, useDatasetQuery } from '@/hooks/queries/useDatasetQuery';
import { useAppStore } from '@/store';

const $ViewOneDatasetPageSearchParams = z.object({
  columnPagination: $DatasetViewPagination.default({ currentPage: 1, itemsPerPage: 10 }),
  rowPagination: $DatasetViewPagination.default({ currentPage: 1, itemsPerPage: 10 })
});

const RouteComponent = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const download = useDownload();
  const currentUser = useAppStore((s) => s.auth.ctx.currentUser);

  const { columnPagination, rowPagination } = Route.useSearch();
  const { datasetId } = Route.useParams();
  const { data: dataset } = useDatasetQuery(datasetId, columnPagination, rowPagination);

  const isManager = Boolean(dataset.managerIds.includes(currentUser!.id));

  const deleteDataset = useDestructiveAction(async () => {
    await axios.delete(`/v1/datasets/${datasetId}`);
    addNotification({ message: `Dataset ${datasetId} deleted`, type: 'success' });
    void navigate({ to: '/portal/datasets' });
  });

  const handleDataDownload = async (format: 'CSV' | 'TSV') => {
    const filename = `${dataset.name}_${new Date().toISOString()}.${format.toLowerCase()}`;
    const response = await axios.get(`/v1/datasets/download-data/${datasetId}/${format}`);
    void download(filename, response.data as string);
  };

  const handleMetadataDownload = async (format: 'CSV' | 'TSV') => {
    const filename = `metadata_${dataset.name}_${new Date().toISOString()}.${format.toLowerCase()}`;
    const response = await axios.get(`/v1/datasets/download-metadata/${datasetId}/${format}`);
    void download(filename, response.data as string);
  };

  const setColumnPagination = (pagination: DatasetViewPaginationType) => {
    void navigate({
      search: (prev) => ({ ...prev, columnPagination: pagination }),
      to: '.'
    });
  };

  const setRowPagination = (pagination: DatasetViewPaginationType) => {
    void navigate({
      search: (prev) => ({ ...prev, rowPagination: pagination }),
      to: '.'
    });
  };

  const licenseInfo = licensesObjects[dataset.license];

  return (
    <div>
      <PageHeading
        actions={
          isManager ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  void navigate({
                    to: '/portal/datasets/$datasetId/edit',
                    params: { datasetId },
                    search: {
                      name: dataset.name,
                      description: dataset.description ?? '',
                      permission: dataset.permission,
                      license: dataset.license
                    }
                  })
                }
              >
                <PencilIcon className="mr-1.5 size-3.5" />
                {t('editDatasetInfo')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  void navigate({
                    to: '/portal/datasets/$datasetId/managers',
                    params: { datasetId: dataset.id },
                    search: {
                      isManager,
                      managerIds: dataset.managerIds
                    }
                  })
                }
              >
                <UsersIcon className="mr-1.5 size-3.5" />
                {t('manageDatasetManagers')}
              </Button>
              <Button size="sm" variant="danger" onClick={() => deleteDataset()}>
                <TrashIcon className="mr-1.5 size-3.5" />
                {t('deleteDataset')}
              </Button>
            </>
          ) : undefined
        }
        description={dataset.description ?? undefined}
      >
        {dataset.name}
      </PageHeading>

      <Card className="mb-6">
        <Card.Content className="pt-6">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
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
              <dd className="mt-1 text-sm" title={licenseInfo?.name}>
                {dataset.license}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Permission</dt>
              <dd className="mt-1">
                <Badge variant="secondary">{dataset.permission}</Badge>
              </dd>
            </div>
          </dl>
        </Card.Content>
      </Card>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Data</h3>
          <DownloadDropdowns
            onDataDownload={(format) => void handleDataDownload(format)}
            onMetadataDownload={(format) => void handleMetadataDownload(format)}
          />
        </div>
        <DatasetPagination
          currentPage={columnPagination.currentPage}
          itemsPerPage={columnPagination.itemsPerPage}
          kind="COLUMN"
          setDatasetPagination={setColumnPagination}
          totalNumberOfItems={dataset.totalNumberOfColumns}
        />
        <div className="overflow-hidden rounded-md border">
          <DatasetTable isManager={isManager} isProject={false} {...dataset} />
        </div>
        <DatasetPagination
          currentPage={rowPagination.currentPage}
          itemsPerPage={rowPagination.itemsPerPage}
          kind="ROW"
          setDatasetPagination={setRowPagination}
          totalNumberOfItems={dataset.totalNumberOfRows}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/portal/datasets/$datasetId/')({
  validateSearch: zodValidator($ViewOneDatasetPageSearchParams),
  loaderDeps: ({ search: { columnPagination, rowPagination } }) => ({ columnPagination, rowPagination }),
  loader: async ({ deps: { columnPagination, rowPagination }, context, params }) => {
    await context.queryClient.ensureQueryData(datasetQueryOptions(params.datasetId, columnPagination, rowPagination));
  },
  component: RouteComponent
});

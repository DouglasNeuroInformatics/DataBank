/* eslint-disable perfectionist/sort-objects */
import { $DatasetViewPagination, licensesObjects } from '@databank/core';
import type { $DatasetViewPagination as DatasetViewPaginationType } from '@databank/core';
import { Badge, Button, Card } from '@douglasneuroinformatics/libui/components';
import { useDestructiveAction, useDownload, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { ArrowLeftIcon, TrashIcon } from 'lucide-react';
import { z } from 'zod/v4';

import { DatasetPagination } from '@/components/DatasetPagination';
import { DatasetTable } from '@/components/DatasetTable';
import { DownloadDropdowns } from '@/components/DownloadDropdowns';
import { PageHeading } from '@/components/PageHeading';
import { useDownloadProjectDataMutation } from '@/hooks/mutations/useDownloadProjectDataMutation';
import { useDownloadProjectMetadataMutation } from '@/hooks/mutations/useDownloadProjectMetadataMutation';
import { useRemoveProjectDatasetMutation } from '@/hooks/mutations/useRemoveProjectDatasetMutation';
import { projectDatasetQueryOptions, useProjectDatasetQuery } from '@/hooks/queries/useProjectDatasetQuery';
import { useAppStore } from '@/store';

const $SearchParams = z.object({
  columnPagination: $DatasetViewPagination.default({ currentPage: 1, itemsPerPage: 10 }),
  rowPagination: $DatasetViewPagination.default({ currentPage: 1, itemsPerPage: 10 })
});

const RouteComponent = () => {
  const { datasetId, projectId } = Route.useParams();
  const { columnPagination, rowPagination } = Route.useSearch();
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const download = useDownload();
  const currentUser = useAppStore((s) => s.auth.ctx.currentUser);
  const removeDatasetMutation = useRemoveProjectDatasetMutation();
  const downloadDataMutation = useDownloadProjectDataMutation();
  const downloadMetadataMutation = useDownloadProjectMetadataMutation();

  const { data: dataset } = useProjectDatasetQuery(projectId, datasetId, columnPagination, rowPagination);

  const isManager = Boolean(dataset.managerIds.includes(currentUser!.id));

  const deleteDataset = useDestructiveAction(() => {
    removeDatasetMutation.mutate(
      { datasetId, projectId },
      {
        onSuccess() {
          void navigate({ params: { projectId }, to: '/portal/projects/$projectId' });
        }
      }
    );
  });

  const handleDataDownload = (format: 'CSV' | 'TSV') => {
    const filename = `${dataset.name}_${new Date().toISOString()}.${format.toLowerCase()}`;
    downloadDataMutation.mutate(
      { datasetId, format, projectId },
      {
        onSuccess(response) {
          void download(filename, response.data);
        }
      }
    );
  };

  const handleMetadataDownload = (format: 'CSV' | 'TSV') => {
    const filename = `metadata_${dataset.name}_${new Date().toISOString()}.${format.toLowerCase()}`;
    downloadMetadataMutation.mutate(
      { datasetId, format, projectId },
      {
        onSuccess(response) {
          void download(filename, response.data);
        }
      }
    );
  };

  const setColumnPagination = (pagination: DatasetViewPaginationType) => {
    void navigate({ search: (prev) => ({ ...prev, columnPagination: pagination }), to: '.' });
  };

  const setRowPagination = (pagination: DatasetViewPaginationType) => {
    void navigate({ search: (prev) => ({ ...prev, rowPagination: pagination }), to: '.' });
  };

  const licenseInfo = licensesObjects[dataset.license];

  return (
    <div>
      <PageHeading
        actions={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void navigate({ params: { projectId }, to: '/portal/projects/$projectId' })}
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
          <DownloadDropdowns
            onDataDownload={(format) => handleDataDownload(format)}
            onMetadataDownload={(format) => handleMetadataDownload(format)}
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
          <DatasetTable isManager={false} isProject={true} {...dataset} id={datasetId} primaryKeys={[]} />
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

export const Route = createFileRoute('/portal/projects/$projectId/datasets/$datasetId/')({
  validateSearch: zodValidator($SearchParams),
  loaderDeps: ({ search: { columnPagination, rowPagination } }) => ({ columnPagination, rowPagination }),
  loader: async ({ context, deps: { columnPagination, rowPagination }, params }) => {
    await context.queryClient.ensureQueryData(
      projectDatasetQueryOptions(params.projectId, params.datasetId, columnPagination, rowPagination)
    );
  },
  component: RouteComponent
});

/* eslint-disable perfectionist/sort-objects */
import { $DatasetViewPagination, formatISODate, licensesObjects } from '@databank/core';
import type { $DatasetViewPagination as DatasetViewPaginationType } from '@databank/core';
import { Button, Card, DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { useDestructiveAction, useDownload, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { ArrowLeftIcon, EllipsisVerticalIcon, TrashIcon } from 'lucide-react';
import { z } from 'zod/v4';

import { DatasetTable } from '@/components/DatasetTable';
import { DatasetToolbar } from '@/components/DatasetToolbar';
import { PageContainer } from '@/components/PageContainer';
import { PageHeading } from '@/components/PageHeading';
import { SectionHeading } from '@/components/SectionHeading';
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
    <PageContainer>
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
              <DropdownMenu>
                <DropdownMenu.Trigger asChild>
                  <Button
                    aria-label={t({ en: 'More actions', fr: "Plus d'actions" })}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <EllipsisVerticalIcon />
                  </Button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                  <DropdownMenu.Item className="text-destructive gap-2" onClick={() => deleteDataset()}>
                    <TrashIcon className="size-4" />
                    {t('deleteDataset')}
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu>
            )}
          </>
        }
        description={dataset.description ?? undefined}
      >
        {dataset.name}
      </PageHeading>

      <Card className="mb-8">
        <Card.Content className="pt-6">
          <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{t('createdAt')}</dt>
              <dd className="mt-1.5 text-sm">{formatISODate(new Date(dataset.createdAt))}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{t('updatedAt')}</dt>
              <dd className="mt-1.5 text-sm">{formatISODate(new Date(dataset.updatedAt))}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                {t('datasetLicense')}
              </dt>
              <dd className="mt-1.5 text-sm" title={licenseInfo?.name}>
                {dataset.license}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                {t({ en: 'Permission', fr: 'Permission' })}
              </dt>
              <dd className="mt-1.5 text-sm">{dataset.permission}</dd>
            </div>
          </dl>
        </Card.Content>
      </Card>

      <SectionHeading
        actions={
          <DatasetToolbar
            columnPagination={columnPagination}
            setColumnPagination={setColumnPagination}
            totalNumberOfColumns={dataset.totalNumberOfColumns}
            onDataDownload={(format) => handleDataDownload(format)}
            onMetadataDownload={(format) => handleMetadataDownload(format)}
          />
        }
      >
        {t({ en: 'Data', fr: 'Données' })}
      </SectionHeading>
      <DatasetTable
        isManager={false}
        isProject={true}
        rowPagination={rowPagination}
        setRowPagination={setRowPagination}
        {...dataset}
        id={datasetId}
        primaryKeys={[]}
      />
    </PageContainer>
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

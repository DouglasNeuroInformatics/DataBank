/* eslint-disable perfectionist/sort-objects */

import { $DatasetViewPagination, licensesObjects } from '@databank/core';
import type { $DatasetViewPagination as DatasetViewPaginationType } from '@databank/core';
import { Button, Card, DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { useDestructiveAction, useDownload, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, UsersIcon } from 'lucide-react';
import { z } from 'zod/v4';

import { DatasetTable } from '@/components/DatasetTable';
import { DatasetToolbar } from '@/components/DatasetToolbar';
import { PageContainer } from '@/components/PageContainer';
import { PageHeading } from '@/components/PageHeading';
import { SectionHeading } from '@/components/SectionHeading';
import { useDeleteDatasetMutation } from '@/hooks/mutations/useDeleteDatasetMutation';
import { useDownloadDatasetDataMutation } from '@/hooks/mutations/useDownloadDatasetDataMutation';
import { useDownloadDatasetMetadataMutation } from '@/hooks/mutations/useDownloadDatasetMetadataMutation';
import { datasetQueryOptions, useDatasetQuery } from '@/hooks/queries/useDatasetQuery';
import { useAppStore } from '@/store';

const $ViewOneDatasetPageSearchParams = z.object({
  columnPagination: $DatasetViewPagination.default({ currentPage: 1, itemsPerPage: 10 }),
  rowPagination: $DatasetViewPagination.default({ currentPage: 1, itemsPerPage: 10 })
});

const RouteComponent = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const download = useDownload();
  const currentUser = useAppStore((s) => s.auth.ctx.currentUser);
  const deleteDatasetMutation = useDeleteDatasetMutation();
  const downloadDataMutation = useDownloadDatasetDataMutation();
  const downloadMetadataMutation = useDownloadDatasetMetadataMutation();

  const { columnPagination, rowPagination } = Route.useSearch();
  const { datasetId } = Route.useParams();
  const { data: dataset } = useDatasetQuery(datasetId, columnPagination, rowPagination);

  const isManager = Boolean(dataset.managerIds.includes(currentUser!.id));

  const deleteDataset = useDestructiveAction(() => {
    deleteDatasetMutation.mutate(datasetId, {
      onSuccess() {
        void navigate({ to: '/portal/datasets' });
      }
    });
  });

  const handleDataDownload = (format: 'CSV' | 'TSV') => {
    const filename = `${dataset.name}_${new Date().toISOString()}.${format.toLowerCase()}`;
    downloadDataMutation.mutate(
      { datasetId, format },
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
      { datasetId, format },
      {
        onSuccess(response) {
          void download(filename, response.data);
        }
      }
    );
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
    <PageContainer>
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
            </>
          ) : undefined
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
              <dd className="mt-1.5 text-sm">{new Date(dataset.createdAt).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{t('updatedAt')}</dt>
              <dd className="mt-1.5 text-sm">{new Date(dataset.updatedAt).toLocaleDateString()}</dd>
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
        isManager={isManager}
        isProject={false}
        rowPagination={rowPagination}
        setRowPagination={setRowPagination}
        {...dataset}
      />
    </PageContainer>
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

/* eslint-disable perfectionist/sort-objects */

import { $DatasetViewPagination, licensesObjects } from '@databank/core';
import { Badge, Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  CalendarIcon,
  ClockIcon,
  ColumnsIcon,
  DatabaseIcon,
  HashIcon,
  RowsIcon,
  ScaleIcon,
  ShieldIcon,
  TagIcon
} from 'lucide-react';
import { z } from 'zod/v4';

import { PageHeading } from '@/components/PageHeading';
import { publicDatasetQueryOptions, usePublicDatasetQuery } from '@/hooks/queries/usePublicDatasetQuery';

const $ViewOneDatasetPageSearchParams = z.object({
  columnPagination: $DatasetViewPagination.default({ currentPage: 1, itemsPerPage: 10 }),
  rowPagination: $DatasetViewPagination.default({ currentPage: 1, itemsPerPage: 10 })
});

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <Card>
    <Card.Content className="flex items-center gap-4 p-5">
      <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="mt-0.5 truncate text-lg font-semibold">{value}</p>
      </div>
    </Card.Content>
  </Card>
);

const ColumnTypeBar: React.FC<{ counts: { [key: string]: number }; total: number }> = ({ counts, total }) => {
  const typeColors: { [key: string]: string } = {
    DATETIME: 'bg-amber-500',
    ENUM: 'bg-purple-500',
    FLOAT: 'bg-emerald-500',
    INT: 'bg-blue-500',
    STRING: 'bg-rose-500'
  };

  return (
    <div className="space-y-3">
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {Object.entries(counts).map(([type, count]) => (
          <div
            className={`${typeColors[type] ?? 'bg-muted'} transition-all`}
            key={type}
            style={{ width: `${(count / total) * 100}%` }}
            title={`${type}: ${count}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {Object.entries(counts).map(([type, count]) => (
          <div className="flex items-center gap-1.5" key={type}>
            <span className={`${typeColors[type] ?? 'bg-muted'} inline-block size-2.5 rounded-full`} />
            <span className="text-muted-foreground text-xs">
              {type} ({count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RouteComponent = () => {
  const { t } = useTranslation();
  const { columnPagination, rowPagination } = Route.useSearch();
  const { datasetId } = Route.useParams();
  const { data: dataset } = usePublicDatasetQuery(datasetId, columnPagination, rowPagination);

  const licenseInfo = licensesObjects[dataset.license];

  const columnTypeCounts = Object.values(dataset.metadata).reduce<{ [key: string]: number }>((acc, col) => {
    acc[col.kind] = (acc[col.kind] ?? 0) + 1;
    return acc;
  }, {});

  const totalNulls = Object.values(dataset.metadata).reduce((sum, col) => sum + col.nullCount, 0);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeading
        actions={
          <Badge className="rounded-md px-2 py-1.5 text-xs" variant="secondary">
            {dataset.datasetType}
          </Badge>
        }
        description={dataset.description ?? undefined}
      >
        {dataset.name}
      </PageHeading>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<RowsIcon className="size-5" />}
          label={t({ en: 'Total Rows', fr: 'Lignes totales' })}
          value={dataset.totalNumberOfRows.toLocaleString()}
        />
        <StatCard
          icon={<ColumnsIcon className="size-5" />}
          label={t({ en: 'Total Columns', fr: 'Colonnes totales' })}
          value={dataset.totalNumberOfColumns.toLocaleString()}
        />
        <StatCard
          icon={<DatabaseIcon className="size-5" />}
          label={t({ en: 'Primary Keys', fr: 'Clés primaires' })}
          value={dataset.primaryKeys.length}
        />
        <StatCard
          icon={<HashIcon className="size-5" />}
          label={t({ en: 'Null Values', fr: 'Valeurs nulles' })}
          value={totalNulls.toLocaleString()}
        />
      </div>

      {/* Metadata & Column Types */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2 text-base">
              <TagIcon className="size-4" />
              {t({ en: 'Dataset Information', fr: 'Informations sur le jeu de données' })}
            </Card.Title>
          </Card.Header>
          <Card.Content>
            <dl className="space-y-3">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                  <ScaleIcon className="size-3.5" />
                  {t({ en: 'License', fr: 'Licence' })}
                </dt>
                <dd className="text-sm font-medium" title={licenseInfo?.name}>
                  {dataset.license}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                  <ShieldIcon className="size-3.5" />
                  {t({ en: 'Permission', fr: 'Permission' })}
                </dt>
                <dd className="text-sm font-medium">{dataset.permission}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                  <CalendarIcon className="size-3.5" />
                  {t({ en: 'Created', fr: 'Créé' })}
                </dt>
                <dd className="text-sm font-medium">{new Date(dataset.createdAt).toLocaleDateString()}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground flex items-center gap-2 text-sm">
                  <ClockIcon className="size-3.5" />
                  {t({ en: 'Updated', fr: 'Mis à jour' })}
                </dt>
                <dd className="text-sm font-medium">{new Date(dataset.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="flex items-center gap-2 text-base">
              <ColumnsIcon className="size-4" />
              {t({ en: 'Column Types', fr: 'Types de colonnes' })}
            </Card.Title>
          </Card.Header>
          <Card.Content>
            {Object.keys(columnTypeCounts).length > 0 ? (
              <ColumnTypeBar
                counts={columnTypeCounts}
                total={Object.values(columnTypeCounts).reduce((a, b) => a + b, 0)}
              />
            ) : (
              <p className="text-muted-foreground text-sm">
                {t({ en: 'No Column Metadata Available', fr: 'Aucune métadonnée de colonne disponible' })}
              </p>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_public/datasets/$datasetId')({
  component: RouteComponent,
  loaderDeps: ({ search: { columnPagination, rowPagination } }) => ({ columnPagination, rowPagination }),
  loader: async ({ deps: { columnPagination, rowPagination }, context, params }) => {
    await context.queryClient.ensureQueryData(
      publicDatasetQueryOptions(params.datasetId, columnPagination, rowPagination)
    );
  },
  validateSearch: zodValidator($ViewOneDatasetPageSearchParams)
});

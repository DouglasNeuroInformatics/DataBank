import { $DatasetInfo } from '@databank/core';
import { Badge, Button, Card } from '@douglasneuroinformatics/libui/components';
import { useDestructiveAction, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { DatabaseIcon, PlusIcon, TrashIcon } from 'lucide-react';

import { PageHeading } from '@/components/PageHeading';
import { useDeleteDatasetMutation } from '@/hooks/mutations/useDeleteDatasetMutation';
import { datasetsQueryOptions, useDatasetsQuery } from '@/hooks/queries/useDatasetsQuery';
import { useAppStore } from '@/store';

const DatasetCard = ({ dataset, isManager }: { dataset: $DatasetInfo; isManager: boolean }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const deleteDatasetMutation = useDeleteDatasetMutation();

  const deleteDataset = useDestructiveAction(() => {
    deleteDatasetMutation.mutate(dataset.id);
  });

  return (
    <Card className="transition-shadow hover:shadow-md">
      <Card.Header className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <Card.Title className="truncate">{dataset.name}</Card.Title>
            {dataset.description && (
              <Card.Description className="mt-1 line-clamp-2">{dataset.description}</Card.Description>
            )}
          </div>
          {dataset.status !== 'Success' && (
            <Badge className="ml-2 shrink-0" variant={dataset.status === 'Fail' ? 'destructive' : 'secondary'}>
              {dataset.status}
            </Badge>
          )}
        </div>
      </Card.Header>
      <Card.Content className="pb-3">
        <dl className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="font-medium">{t('datasetLicense')}</dt>
          <dd className="truncate">{dataset.license}</dd>
          <dt className="font-medium">{t('createdAt')}</dt>
          <dd>{new Date(dataset.createdAt).toLocaleDateString()}</dd>
        </dl>
      </Card.Content>
      <Card.Footer className="flex items-center justify-between gap-2">
        <Button
          disabled={dataset.status !== 'Success'}
          size="sm"
          variant="outline"
          onClick={() => void navigate({ to: `/portal/datasets/${dataset.id}` })}
        >
          {isManager ? t('manageDataset') : t('viewDataset')}
        </Button>
        {dataset.status === 'Fail' && isManager && (
          <Button size="sm" variant="danger" onClick={() => deleteDataset()}>
            <TrashIcon className="mr-1.5 size-3.5" />
            {t('delete')}
          </Button>
        )}
      </Card.Footer>
    </Card>
  );
};

const RouteComponent = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const currentUser = useAppStore((s) => s.auth.ctx.currentUser);
  const { data: datasets } = useDatasetsQuery();

  return (
    <div>
      <PageHeading
        actions={
          <Button size="sm" onClick={() => void navigate({ to: '/portal/datasets/create' })}>
            <PlusIcon className="mr-1.5 size-4" />
            {t('createDataset')}
          </Button>
        }
      >
        {t({
          en: 'Datasets',
          fr: 'Ensembles de données'
        })}
      </PageHeading>
      {datasets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <DatabaseIcon className="text-muted-foreground/50 size-12" />
          <p className="text-muted-foreground mt-4 text-lg font-medium">
            {t({
              en: 'No Datasets Available',
              fr: 'Aucun ensemble de données disponible'
            })}
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            {t({
              en: 'Create your first dataset to get started.',
              fr: 'Créez votre premier ensemble de données pour commencer.'
            })}
          </p>
          <Button className="mt-6" variant="outline" onClick={() => void navigate({ to: '/portal/datasets/create' })}>
            <PlusIcon className="mr-1.5 size-4" />
            {t('createDataset')}
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {datasets.map((dataset) => {
            const isManager = dataset.managerIds.includes(currentUser!.id);
            return <DatasetCard dataset={dataset} isManager={isManager} key={dataset.id} />;
          })}
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/portal/datasets/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(datasetsQueryOptions());
  }
});

import { $DatasetInfo, formatISODate } from '@databank/core';
import { Badge, Button, Card, DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { useDestructiveAction, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { DatabaseIcon, EllipsisVerticalIcon, PlusIcon, TrashIcon } from 'lucide-react';

import { EmptyState } from '@/components/EmptyState';
import { PageContainer } from '@/components/PageContainer';
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

  const statusLabel = {
    Fail: t({ en: 'Failed', fr: 'Échec' }),
    Processing: t({ en: 'Processing', fr: 'En traitement' }),
    Success: t({ en: 'Ready', fr: 'Prêt' })
  }[dataset.status];

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <Card.Header className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Card.Title className="truncate">{dataset.name}</Card.Title>
          {dataset.status !== 'Success' && (
            <Badge className="shrink-0" variant={dataset.status === 'Fail' ? 'destructive' : 'secondary'}>
              {statusLabel}
            </Badge>
          )}
        </div>
        <Card.Description className="line-clamp-2 min-h-10">{dataset.description}</Card.Description>
      </Card.Header>
      <Card.Content className="pb-3">
        <dl className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <dt className="font-medium">{t({ en: 'License', fr: 'Licence' })}</dt>
          <dd className="truncate">{dataset.license}</dd>
          <dt className="font-medium">{t({ en: 'Created', fr: 'Créé le' })}</dt>
          <dd>{formatISODate(new Date(dataset.createdAt))}</dd>
        </dl>
      </Card.Content>
      <Card.Footer className="mt-auto flex items-center justify-between gap-2 pt-3">
        <Button
          disabled={dataset.status !== 'Success'}
          size="sm"
          variant="outline"
          onClick={() => void navigate({ to: `/portal/datasets/${dataset.id}` })}
        >
          {isManager ? t('manageDataset') : t('viewDataset')}
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
                {t('delete')}
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
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
    <PageContainer>
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
        <EmptyState
          action={
            <Button variant="outline" onClick={() => void navigate({ to: '/portal/datasets/create' })}>
              <PlusIcon className="mr-1.5 size-4" />
              {t('createDataset')}
            </Button>
          }
          description={t({
            en: 'Create your first dataset to get started.',
            fr: 'Créez votre premier jeu de données pour commencer.'
          })}
          icon={DatabaseIcon}
          title={t({
            en: 'No Datasets Available',
            fr: 'Aucun jeu de données disponible'
          })}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {datasets.map((dataset) => {
            const isManager = dataset.managerIds.includes(currentUser!.id);
            return <DatasetCard dataset={dataset} isManager={isManager} key={dataset.id} />;
          })}
        </div>
      )}
    </PageContainer>
  );
};

export const Route = createFileRoute('/portal/datasets/')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(datasetsQueryOptions());
  }
});

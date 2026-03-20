import { licensesObjects } from '@databank/core';
import { Button, Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon, DatabaseIcon, PlusIcon } from 'lucide-react';

import { PageHeading } from '@/components/PageHeading';
import { ownedDatasetsQueryOptions, useOwnedDatasetsQuery } from '@/hooks/queries/useOwnedDatasetsQuery';

const RouteComponent = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { projectId } = Route.useParams();
  const { data: datasets } = useOwnedDatasetsQuery();

  return (
    <div>
      <PageHeading
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              void navigate({
                params: { projectId },
                to: '/portal/projects/$projectId'
              })
            }
          >
            <ArrowLeftIcon className="mr-1.5 size-3.5" />
            {t({
              en: 'Back to Project',
              fr: 'Retour au projet'
            })}
          </Button>
        }
        description={t({
          en: 'Select a dataset to add to this project.',
          fr: 'Sélectionnez un base de données à ajouter à ce projet.'
        })}
      >
        {t('datasetsAvailableToAdd')}
      </PageHeading>

      {datasets.length === 0 ? (
        <Card>
          <Card.Content className="flex flex-col items-center justify-center py-12">
            <DatabaseIcon className="text-muted-foreground/50 size-10" />
            <p className="text-muted-foreground mt-3 text-sm">
              {t({
                en: 'No datasets available. Create a dataset first.',
                fr: "Aucun base de données disponible. Créez d'abord un base de données."
              })}
            </p>
          </Card.Content>
        </Card>
      ) : (
        <Card>
          <Card.Content className="divide-y p-0">
            {datasets.map((dataset) =>
              dataset ? (
                <div className="flex w-full items-center justify-between px-6 py-5" key={dataset.id}>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{dataset.name}</p>
                    {dataset.description && (
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{dataset.description}</p>
                    )}
                    <div className="text-muted-foreground mt-2 flex flex-col text-sm">
                      <p>
                        <span className="font-semibold tracking-tight">{t({ en: 'License: ', fr: 'Licence : ' })}</span>
                        {licensesObjects[dataset.license]?.name ?? dataset.license}
                      </p>
                      <p>
                        <span className="font-semibold tracking-tight">{t({ en: 'Created: ', fr: 'Créé : ' })}</span>
                        {new Date(dataset.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="ml-6 shrink-0"
                    size="sm"
                    onClick={() =>
                      void navigate({
                        params: { datasetId: dataset.id, projectId },
                        to: '/portal/projects/$projectId/datasets/$datasetId/add-columns'
                      })
                    }
                  >
                    <PlusIcon className="mr-1.5 size-3.5" />
                    {t('selectDataset')}
                  </Button>
                </div>
              ) : null
            )}
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export const Route = createFileRoute('/portal/projects/$projectId/add-dataset')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(ownedDatasetsQueryOptions());
  }
});

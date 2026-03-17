import { useEffect, useState } from 'react';

import type { $DatasetCardProps } from '@databank/core';
import { Badge, Button, Card, Spinner } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { ArrowLeftIcon, DatabaseIcon, PlusIcon } from 'lucide-react';

import { PageHeading } from '@/components/PageHeading';

const RouteComponent = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { projectId } = Route.useParams();
  const [datasetsInfoArray, setDatasetsInfoArray] = useState<$DatasetCardProps[] | null>(null);

  useEffect(() => {
    axios
      .get<$DatasetCardProps[]>('/v1/datasets/owned-by')
      .then((response) => {
        setDatasetsInfoArray(response.data);
      })
      .catch(console.error);
  }, []);

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
          fr: 'Sélectionnez un ensemble de données à ajouter à ce projet.'
        })}
      >
        {t('datasetsAvailableToAdd')}
      </PageHeading>

      {!datasetsInfoArray ? (
        <div className="flex items-center justify-center py-16">
          <Spinner />
        </div>
      ) : datasetsInfoArray.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <DatabaseIcon className="text-muted-foreground/50 size-12" />
          <p className="text-muted-foreground mt-4 text-sm">
            {t({
              en: 'No datasets available. Create a dataset first.',
              fr: "Aucun ensemble de données disponible. Créez d'abord un ensemble de données."
            })}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {datasetsInfoArray.map((datasetInfo) =>
            datasetInfo ? (
              <Card className="transition-shadow hover:shadow-md" key={datasetInfo.id}>
                <Card.Header className="pb-3">
                  <Card.Title className="truncate">{datasetInfo.name}</Card.Title>
                  {datasetInfo.description && (
                    <Card.Description className="line-clamp-2">{datasetInfo.description}</Card.Description>
                  )}
                </Card.Header>
                <Card.Content className="pb-3">
                  <Badge variant="secondary">{datasetInfo.license}</Badge>
                  <p className="text-muted-foreground mt-2 text-xs">
                    {t('createdAt')}: {new Date(datasetInfo.createdAt).toLocaleDateString()}
                  </p>
                </Card.Content>
                <Card.Footer>
                  <Button
                    size="sm"
                    onClick={() =>
                      void navigate({
                        params: { datasetId: datasetInfo.id, projectId },
                        to: '/portal/projects/$projectId/datasets/$datasetId/add-columns'
                      })
                    }
                  >
                    <PlusIcon className="mr-1.5 size-3.5" />
                    {t('selectDataset')}
                  </Button>
                </Card.Footer>
              </Card>
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/portal/projects/$projectId/add-dataset')({
  component: RouteComponent
});

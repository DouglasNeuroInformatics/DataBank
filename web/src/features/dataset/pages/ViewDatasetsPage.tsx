import { $DatasetInfo } from '@databank/core';
import { Button, Card, Heading } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate } from '@tanstack/react-router';

import { PageHeading } from '@/components/PageHeading';
import { useAuthStore } from '@/stores/auth-store';

import DatasetCard from '../components/DatasetCard';

type ViewDatasetsPageProps = {
  datasetsInfoArray: $DatasetInfo[];
  isPublic: boolean;
};

const ViewDatasetsPage = ({ datasetsInfoArray, isPublic }: ViewDatasetsPageProps) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();

  return (
    <>
      <PageHeading>
        {t({
          en: 'Datasets',
          fr: 'Ensembles de données'
        })}
      </PageHeading>
      <Card>
        <Card.Header>
          <Card.Title className="text-3xl"></Card.Title>
          {!isPublic && (
            <Button
              className="m-2"
              variant={'secondary'}
              onClick={() =>
                void navigate({
                  to: '/portal/datasets/create'
                })
              }
            >
              {t('createDataset')}
            </Button>
          )}
        </Card.Header>
        <Card.Content>
          {datasetsInfoArray?.length === 0 ? (
            <Heading variant={'h2'}>
              {t({
                en: 'No Datasets Available',
                fr: 'Aucun ensemble de données disponible'
              })}
            </Heading>
          ) : (
            <ul>
              {datasetsInfoArray?.map((datasetInfo) => {
                const isManager = datasetInfo.managerIds.includes(currentUser!.id);
                return (
                  datasetInfo && (
                    <li key={datasetInfo.id}>
                      <DatasetCard {...datasetInfo} isManager={isManager} isPublic={isPublic} />
                    </li>
                  )
                );
              })}
            </ul>
          )}
        </Card.Content>
        <Card.Footer className="flex justify-between"></Card.Footer>
      </Card>
    </>
  );
};

export { ViewDatasetsPage };

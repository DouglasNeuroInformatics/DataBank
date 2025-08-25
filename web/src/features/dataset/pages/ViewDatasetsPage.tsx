import { Button, Card, Heading } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate } from '@tanstack/react-router';

import { LoadingFallback } from '@/components';
import { PageHeading } from '@/components/PageHeading';

import DatasetCard from '../components/DatasetCard';
import { useDatasetsQuery } from '../hooks/useDatasetsQuery';
import { usePublicDatasetsQuery } from '../hooks/usePublicDatasetsQuery';

type ViewDatasetsPageProps = {
  isPublic: boolean;
};

const ViewDatasetsPage = ({ isPublic }: ViewDatasetsPageProps) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const datasetsInfoQuery = isPublic ? usePublicDatasetsQuery() : useDatasetsQuery();

  if (!datasetsInfoQuery.data) {
    return <LoadingFallback />;
  }

  const datasetsInfoArray = datasetsInfoQuery.data;

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
                return (
                  datasetInfo && (
                    <li key={datasetInfo.id}>
                      <DatasetCard {...datasetInfo} />
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

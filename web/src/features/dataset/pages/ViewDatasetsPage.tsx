import { Button, Card, Heading } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate } from '@tanstack/react-router';

import { LoadingFallback } from '@/components';
import { PageHeading } from '@/components/PageHeading';
import { useAuthStore } from '@/stores/auth-store';

import DatasetCard from '../components/DatasetCard';
import { useDatasetsQuery } from '../hooks/useDatasetsQuery';
import { usePublicDatasetsQuery } from '../hooks/usePublicDatasetsQuery';

type ViewDatasetsPageProps = {
  isPublic: boolean;
};

const ViewDatasetsPage = ({ isPublic }: ViewDatasetsPageProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();

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
              Create Dataset
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
              {datasetsInfoArray?.map((datasetInfo, i) => {
                let isManager: boolean;
                if (!currentUser?.id) {
                  isManager = false;
                } else {
                  isManager = datasetInfo.managerIds.includes(currentUser.id);
                }
                return (
                  datasetInfo && (
                    <li key={i}>
                      <DatasetCard
                        createdAt={datasetInfo.createdAt}
                        datasetType={datasetInfo.datasetType}
                        description={datasetInfo.description}
                        id={datasetInfo.id}
                        isManager={isManager}
                        isPublic={isPublic}
                        isReadyToShare={dataset.isReadyToShare}
                        license={datasetInfo.license}
                        managerIds={datasetInfo.managerIds}
                        name={datasetInfo.name}
                        permission={datasetInfo.permission}
                        status={datasetInfo.status}
                        updatedAt={datasetInfo.updatedAt}
                      />
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

/* eslint-disable perfectionist/sort-objects */
import { useEffect, useState } from 'react';

import type { DatasetCardProps } from '@databank/types';
import { Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { type RouteObject, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth-store';

import PublicDatasetCard from '../components/PublicDatasetCard';

const ViewPublicDatasetsPage = () => {
  const { t } = useTranslation('common');
  const auth = useAuthStore();
  const navigate = useNavigate();
  const [datasetsInfoArray, setDatasetsInfoArray] = useState<DatasetCardProps[] | null>(null);

  useEffect(() => {
    if (auth.accessToken) {
      navigate('/portal/datasets');
    }
    axios
      .get<DatasetCardProps[]>('/v1/datasets/public')
      .then((response) => {
        setDatasetsInfoArray(response.data);
      })
      .catch(console.error);
  }, [auth.accessToken]);

  // // useEffect to fetch all public datasets information
  // // here should use a function to get all
  return (
    <>
      <Card className="my-3">
        <Card.Header>
          <Card.Title className="text-3xl">{t('publicDatasets')}</Card.Title>
        </Card.Header>
        <Card.Content>
          <ul>
            {datasetsInfoArray?.map((datasetInfo, i) => {
              return (
                <li key={i}>
                  <PublicDatasetCard
                    createdAt={datasetInfo.createdAt}
                    datasetType={datasetInfo.datasetType}
                    description={datasetInfo.description}
                    id={datasetInfo.id}
                    isManager={false}
                    isReadyToShare={false}
                    license={datasetInfo.license}
                    managerIds={datasetInfo.managerIds}
                    name={datasetInfo.name}
                    permission={'PUBLIC'}
                    updatedAt={datasetInfo.updatedAt}
                  />
                </li>
              );
            })}
          </ul>
        </Card.Content>
        <Card.Footer className="flex justify-between"></Card.Footer>
      </Card>
    </>
  );
};

export const ViewPublicDatasetsRoute: RouteObject = {
  path: 'datasets',
  element: <ViewPublicDatasetsPage />
};

import { useEffect, useState } from 'react';

import type { DatasetCardProps } from '@databank/types';
import { Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { type RouteObject, useParams } from 'react-router-dom';

import AddProjectDatasetCard from '../components/AddProjectDatasetCard';

const AddProjectDatasetPage = () => {
  const { t } = useTranslation('common');
  const [datasetsInfoArray, setDatasetsInfoArray] = useState<DatasetCardProps[] | null>(null);
  const params = useParams();

  useEffect(() => {
    axios
      .get<DatasetCardProps[]>('/v1/datasets/owned-by')
      .then((response) => {
        setDatasetsInfoArray(response.data);
      })
      .catch(console.error);
  }, []);

  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-3xl">{t('datasetsAvailableToAdd')}</Card.Title>
      </Card.Header>
      <Card.Content>
        <ul>
          {datasetsInfoArray?.map((datasetInfo, i) => {
            return (
              datasetInfo && (
                <li key={i}>
                  <AddProjectDatasetCard
                    createdAt={datasetInfo.createdAt}
                    datasetId={datasetInfo.id}
                    description={datasetInfo.description}
                    license={datasetInfo.license}
                    name={datasetInfo.name}
                    projectId={params.projectId!}
                    updatedAt={datasetInfo.updatedAt}
                  />
                </li>
              )
            );
          })}
        </ul>
      </Card.Content>
      <Card.Footer className="flex justify-between"></Card.Footer>
    </Card>
  );
};

export const AddProjectDatasetRoute: RouteObject = {
  element: <AddProjectDatasetPage />,
  path: 'project/addDataset/:projectId'
};

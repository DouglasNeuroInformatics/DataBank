import { useEffect, useState } from 'react';

import type { DatasetCardProps } from '@databank/core';
import { Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { getRouteApi } from '@tanstack/react-router';
import axios from 'axios';

import AddProjectDatasetCard from '../components/AddProjectDatasetCard';

const AddProjectDatasetPage = () => {
  const { t } = useTranslation('common');
  const [datasetsInfoArray, setDatasetsInfoArray] = useState<DatasetCardProps[] | null>(null);
  const route = getRouteApi('/portal/projects/add-dataset/$projectId');
  const params = route.useParams();

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
                    projectId={params.projectId}
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

export { AddProjectDatasetPage };

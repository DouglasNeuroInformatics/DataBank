import React, { useEffect, useState } from 'react';

import type { DatasetCardProps } from '@databank/types';
import { Card } from '@douglasneuroinformatics/libui/components';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { type RouteObject } from 'react-router-dom';

import ProjectDatasetCard from '../components/ProjectDatasetCard';

const AddProjectDatasetPage = () => {
  const { t } = useTranslation('common');
  const [datasetsInfoArray, setDatasetsInfoArray] = useState<DatasetCardProps[] | null>(null);

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
                  <ProjectDatasetCard
                    createdAt={datasetInfo.createdAt}
                    description={datasetInfo.description}
                    id={datasetInfo.id}
                    license={datasetInfo.license}
                    name={datasetInfo.name}
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
  path: 'project/addDataset'
};

/* eslint-disable perfectionist/sort-objects */
import React, { useEffect, useState } from 'react';

import type { DatasetCardProps } from '@databank/types';
import { Button, Card } from '@douglasneuroinformatics/libui/components';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { type RouteObject, useNavigate, useParams } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth-store';

import DatasetCard from '../../dataset/components/DatasetCard';

// the dataset card should show a list of user emails and when the manager clicks remove user,
// there should be a callback function for the

const ViewProjectDatasetsPage = () => {
  const params = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();

  const [datasetsInfoArray, setDatasetsInfoArray] = useState<DatasetCardProps[] | null>(null);

  useEffect(() => {
    axios
      .get<DatasetCardProps[]>(`/v1/datasets/project/${params.id}`)
      .then((response) => {
        setDatasetsInfoArray(response.data);
      })
      .catch(console.error);
  }, []);

  return (
    <Card>
      <Card.Header>
        <Card.Title className="text-3xl">{t('datasets')}</Card.Title>
        <Button className="m-2" variant={'secondary'} onClick={() => navigate('/portal/createDataset')}>
          Create Dataset
        </Button>
      </Card.Header>
      <Card.Content>
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
                    isReadyToShare={false}
                    license={datasetInfo.license}
                    managerIds={datasetInfo.managerIds}
                    name={datasetInfo.name}
                    permission={datasetInfo.permission}
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

export const viewProjectDatasetsRoute: RouteObject = {
  path: 'projects/datasets',
  element: <ViewProjectDatasetsPage />
};
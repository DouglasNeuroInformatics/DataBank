/* eslint-disable perfectionist/sort-objects */
import { useEffect, useState } from 'react';

import type { DatasetCardProps } from '@databank/core';
import { Button, Card } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';

import { PageHeading } from '@/components/PageHeading';
import { useAuthStore } from '@/stores/auth-store';

import DatasetCard from '../components/DatasetCard';

// the dataset card should show a list of user emails and when the manager clicks remove user,
// there should be a callback function for the

const ViewDatasetsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuthStore();

  const [datasetsInfoArray, setDatasetsInfoArray] = useState<DatasetCardProps[] | null>(null);

  useEffect(() => {
    axios
      .get<DatasetCardProps[]>('/v1/datasets')
      .then((response) => {
        setDatasetsInfoArray(response.data);
      })
      .catch(console.error);
  }, []);

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
          <Button
            className="m-2"
            variant={'secondary'}
            onClick={() =>
              void navigate({
                to: '/portal/datasets/create-dataset'
              })
            }
          >
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
    </>
  );
};

export { ViewDatasetsPage };

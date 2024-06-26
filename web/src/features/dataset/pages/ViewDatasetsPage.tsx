/* eslint-disable perfectionist/sort-objects */
import React, { useEffect, useState } from 'react';

import type { DatasetCardProps } from '@databank/types';
import axios from 'axios';
import type { RouteObject } from 'react-router-dom';

import DatasetCard from '../components/DatasetCard';

// the dataset card should show a list of user emails and when the manager clicks remove user,
// there should be a callback function for the

const ViewDatasetsPage = () => {
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
    <ul>
      {datasetsInfoArray?.map((datasetInfo, i) => {
        return (
          <li key={i}>
            <DatasetCard
              createdAt={datasetInfo.createdAt}
              datasetType={'TABULAR'}
              description={datasetInfo.description}
              id={datasetInfo.id}
              isManager={datasetInfo.isManager}
              license={datasetInfo.license}
              managerIds={datasetInfo.managerIds}
              name={datasetInfo.name}
              updatedAt={datasetInfo.updatedAt}
            />
          </li>
        );
      })}
    </ul>
  );
};

export const viewDatasetsRoute: RouteObject = {
  path: 'datasets',
  element: <ViewDatasetsPage />
};

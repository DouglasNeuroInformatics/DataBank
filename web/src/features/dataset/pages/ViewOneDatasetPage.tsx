/* eslint-disable perfectionist/sort-objects */
import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { type RouteObject, useLocation } from 'react-router-dom';

import { LoadingFallback } from '@/components';

import DatasetTable, { type TabularDataset } from '../components/DatasetTable';

// the dataset card should show a list of user emails and when the manager clicks remove user,
// there should be a callback function for the

const ViewOneDatasetPage = () => {
  // location contains the variable in the state of the navigate function
  const location = useLocation();

  const [dataset, setDataset] = useState<TabularDataset | null>(null);

  useEffect(() => {
    const fetchDataset = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      setDataset(await axios.get(`/v1/datasets/${location.state}`));
    };
    void fetchDataset();
  }, [location.state]);

  return dataset ? (
    <DatasetTable
      columnIds={dataset.columnIds}
      columns={dataset.columns}
      createdAt={dataset.createdAt}
      datasetType={'BASE'}
      description={dataset.description}
      id={dataset.id}
      isManager={true}
      isReadyToShare={false}
      license={dataset.license}
      managerIds={dataset.managerIds}
      metadata={dataset.metadata}
      name={dataset.name}
      permission={'LOGIN'}
      primaryKeys={dataset.primaryKeys}
      rows={dataset.rows}
      updatedAt={dataset.updatedAt}
    />
  ) : (
    <LoadingFallback />
  );
};

export const viewOneDatasetRoute: RouteObject = {
  path: 'dataset',
  element: <ViewOneDatasetPage />
};

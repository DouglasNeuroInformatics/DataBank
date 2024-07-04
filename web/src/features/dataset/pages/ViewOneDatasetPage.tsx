/* eslint-disable perfectionist/sort-objects */
import React, { useEffect } from 'react';

import { error } from 'console';

import axios from 'axios';
import type { RouteObject } from 'react-router-dom';

import DatasetTable, { type TabularDataset } from '../components/DatasetTable';

// the dataset card should show a list of user emails and when the manager clicks remove user,
// there should be a callback function for the

const ViewOneDatasetPage = (datasetId: string) => {
  // const [dataset, setDataset] = useState<TabularDataset | null>(null);

  // useEffect(async () => {
  //   setDataset(await axios.get(`/v1/datasets/${datasetId}`).then().catch(error))
  // }, [datasetId]);

  // return (
  //   <DatasetTable
  //     columnIds={dataset.columnIds}
  //     columns={dataset.columns}
  //     createdAt={dataset.createdAt}
  //     datasetType={'BASE'}
  //     description={dataset.description}
  //     id={dataset.id}
  //     isManager={true}
  //     license={dataset.license}
  //     managerIds={dataset.managerIds}
  //     metadata={dataset.metadata}
  //     name={dataset.name}
  //     primaryKeys={dataset.primaryKeys}
  //     rows={dataset.rows}
  //     updatedAt={dataset.updatedAt} />
  // );

  return <h1>WOWOW</h1>;
};

export const viewOneDatasetRoute: RouteObject = {
  path: 'dataset',
  element: <ViewOneDatasetPage />
};

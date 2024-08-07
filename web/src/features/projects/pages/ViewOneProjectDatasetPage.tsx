/* eslint-disable perfectionist/sort-objects */
import React, { useEffect, useState } from 'react';

import type { DatasetViewPaginationDto, TabularDataset } from '@databank/types';
import axios from 'axios';
import { type RouteObject, useLocation } from 'react-router-dom';

import { LoadingFallback } from '@/components';
import { DatasetPagination } from '@/features/dataset/components/DatasetPagination';
import DatasetTable from '@/features/dataset/components/DatasetTable';

// the dataset card should show a list of user emails and when the manager clicks remove user,
// there should be a callback function for the

const ViewOneProjectDatasetPage = () => {
  // location contains the variable in the state of the navigate function
  const location = useLocation();

  const [dataset, setDataset] = useState<TabularDataset | null>(null);

  const [columnPaginationDto, setColumnPaginationDto] = useState<DatasetViewPaginationDto | null>({
    columnsPerPage: 10,
    currentColumnPage: 1,
    rowsPerPage: 10,
    currentRowPage: 1
  });

  const [rowPaginationDto, setRowPaginationDto] = useState<DatasetViewPaginationDto | null>({
    columnsPerPage: 10,
    currentColumnPage: 1,
    rowsPerPage: 10,
    currentRowPage: 1
  });

  useEffect(() => {
    const fetchDataset = async () => {
      setDataset(
        await axios.get(`/v1/datasets/${location.state}`, {
          data: {
            datasetViewPaginationDto: rowPaginationDto
          }
        })
      );
    };
    void fetchDataset();
  }, [location.state]);

  return dataset ? (
    <>
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

      <DatasetPagination
        datasetPaginationDto={{
          columnsPerPage: 0,
          currentColumnPage: 0,
          currentRowPage: 0,
          rowsPerPage: 0
        }}
        setDatasetPagination={setColumnPaginationDto}
      />

      <h1>{columnPaginationDto?.currentColumnPage}</h1>

      <DatasetPagination
        datasetPaginationDto={{
          columnsPerPage: 0,
          currentColumnPage: 0,
          currentRowPage: 0,
          rowsPerPage: 0
        }}
        setDatasetPagination={setRowPaginationDto}
      />

      <h1>{rowPaginationDto?.currentRowPage}</h1>
    </>
  ) : (
    <LoadingFallback />
  );
};

export const viewOneProjectDatasetRoute: RouteObject = {
  path: 'project/dataset',
  element: <ViewOneProjectDatasetPage />
};

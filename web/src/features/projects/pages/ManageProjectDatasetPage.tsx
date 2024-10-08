/* eslint-disable perfectionist/sort-objects */
import { useEffect, useState } from 'react';

import type { DatasetViewPaginationDto, TabularDataset } from '@databank/types';
import axios from 'axios';
import { type RouteObject, useParams } from 'react-router-dom';

import { LoadingFallback } from '@/components';
import { DatasetPagination } from '@/features/dataset/components/DatasetPagination';
import DatasetTable from '@/features/dataset/components/DatasetTable';

// should show the current view and also allow the manager to add
// or remove columns from the project

const ViewOneProjectDatasetPage = () => {
  const params = useParams();
  const [dataset, setDataset] = useState<null | TabularDataset>(null);

  const [columnPaginationDto, setColumnPaginationDto] = useState<DatasetViewPaginationDto | null>(null);

  const [rowPaginationDto, setRowPaginationDto] = useState<DatasetViewPaginationDto | null>(null);

  useEffect(() => {
    const fetchDataset = async () => {
      setDataset(
        await axios.post(`/v1/datasets/project/${params.id}`, {
          data: {
            columnPaginationDto,
            rowPaginationDto
          }
        })
      );
    };
    void fetchDataset();
  }, [params.id]);

  return dataset ? (
    <>
      <h1>{columnPaginationDto?.currentPage}</h1>
      <DatasetPagination
        currentPage={0}
        itemsPerPage={0}
        kind={'COLUMN'}
        setDatasetPagination={setColumnPaginationDto}
        totalNumberOfItems={0}
      />

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
        totalNumberOfColumns={0}
        totalNumberOfRows={0}
        updatedAt={dataset.updatedAt}
      />

      <h1>{rowPaginationDto?.currentPage}</h1>
      <DatasetPagination
        currentPage={0}
        itemsPerPage={0}
        kind={'ROW'}
        setDatasetPagination={setRowPaginationDto}
        totalNumberOfItems={0}
      />
    </>
  ) : (
    <LoadingFallback />
  );
};

export const ViewOneProjectDatasetRoute: RouteObject = {
  path: 'project/dataset/:id',
  element: <ViewOneProjectDatasetPage />
};

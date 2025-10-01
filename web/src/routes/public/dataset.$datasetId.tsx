/* eslint-disable perfectionist/sort-objects */
import { $DatasetViewPagination, $TabularDataset } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useParams, useSearch } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import axios from 'axios';
import z from 'zod/v4';

import { ViewOneDatasetPage } from '@/features/dataset/pages/ViewOneDatasetPage';
import { queryClient } from '@/services/react-query';

const $ViewOneDatasetPageSearchParams = z.object({
  columnPagination: $DatasetViewPagination.default({ currentPage: 1, itemsPerPage: 10 }),
  rowPagination: $DatasetViewPagination.default({ currentPage: 1, itemsPerPage: 10 })
});

const getPublicDatasetQueryOptions = (
  datasetId: string,
  columnPagination: $DatasetViewPagination,
  rowPagination: $DatasetViewPagination
) => {
  const dataQueryUrl = `/v1/datasets/public/${datasetId}`;
  return queryOptions({
    queryFn: async () => {
      const response = await axios.post<$TabularDataset>(dataQueryUrl, {
        columnPagination,
        rowPagination
      });
      return $TabularDataset.parse(response.data);
    },
    queryKey: [
      'dataset-query',
      datasetId,
      columnPagination.currentPage,
      columnPagination.itemsPerPage,
      rowPagination.currentPage,
      rowPagination.itemsPerPage
    ]
  });
};

export const Route = createFileRoute('/public/dataset/$datasetId')({
  validateSearch: zodValidator($ViewOneDatasetPageSearchParams),
  loaderDeps: ({ search: { columnPagination, rowPagination } }) => ({ columnPagination, rowPagination }),
  loader: async ({ deps: { columnPagination, rowPagination }, params }) => {
    const viewOnePublicDatasetOptions = getPublicDatasetQueryOptions(params.datasetId, columnPagination, rowPagination);
    await queryClient.ensureQueryData(viewOnePublicDatasetOptions);
  },
  component: () => {
    const { columnPagination, rowPagination } = useSearch({ from: '/public/dataset/$datasetId' });
    const params = useParams({ from: '/public/dataset/$datasetId' });
    const downloadDataUrl = `/v1/datasets/public/download-data/`;
    const downloadMetaDataUrl = `/v1/datasets/public/download-metadata/`;
    const viewOnePublicDatasetOptions = getPublicDatasetQueryOptions(params.datasetId, columnPagination, rowPagination);
    const datasetQuery = useSuspenseQuery(viewOnePublicDatasetOptions);
    const dataset = datasetQuery.data;

    return (
      <ViewOneDatasetPage
        columnPagination={columnPagination}
        dataset={dataset}
        downloadDataUrl={downloadDataUrl}
        downloadMetaDataUrl={downloadMetaDataUrl}
        rowPagination={rowPagination}
      />
    );
  }
});

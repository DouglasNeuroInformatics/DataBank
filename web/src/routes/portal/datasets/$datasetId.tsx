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

const getDatasetQueryKey = (
  datasetId: string,
  columnPagination: $DatasetViewPagination,
  rowPagination: $DatasetViewPagination
) =>
  `dataset-query-${datasetId}-colPage-${columnPagination.currentPage}-colItems-${columnPagination.itemsPerPage}-rowPage-${rowPagination.currentPage}-rowItems-${rowPagination.itemsPerPage}`;

const getViewDatasetQueryOptions = (
  datasetId: string,
  columnPagination: $DatasetViewPagination,
  rowPagination: $DatasetViewPagination,
  queryKey: string
) => {
  const dataQueryUrl = `/v1/datasets/${datasetId}`;
  return queryOptions({
    queryFn: async () => {
      const response = await axios.post<$TabularDataset>(dataQueryUrl, {
        columnPagination,
        rowPagination
      });
      return $TabularDataset.parse(response.data);
    },
    queryKey: [queryKey]
  });
};

export const Route = createFileRoute('/portal/datasets/$datasetId')({
  validateSearch: zodValidator($ViewOneDatasetPageSearchParams),
  loaderDeps: ({ search: { columnPagination, rowPagination } }) => ({ columnPagination, rowPagination }),
  loader: async ({ deps: { columnPagination, rowPagination }, params }) => {
    const viewOneDatasetOptions = getViewDatasetQueryOptions(
      params.datasetId,
      columnPagination,
      rowPagination,
      getDatasetQueryKey(params.datasetId, columnPagination, rowPagination)
    );
    await queryClient.ensureQueryData(viewOneDatasetOptions);
  },
  component: () => {
    const { columnPagination, rowPagination } = useSearch({ from: '/portal/datasets/$datasetId' });
    const params = useParams({ from: '/portal/datasets/$datasetId' });
    const downloadDataUrl = `/v1/datasets/download-data/`;
    const downloadMetaDataUrl = `/v1/datasets/download-metadata/`;
    const queryKey = getDatasetQueryKey(params.datasetId, columnPagination, rowPagination);

    const viewOneDatasetOptions = getViewDatasetQueryOptions(
      params.datasetId,
      columnPagination,
      rowPagination,
      queryKey
    );

    const datasetQuery = useSuspenseQuery(viewOneDatasetOptions);
    const dataset = datasetQuery.data;

    return (
      <ViewOneDatasetPage
        columnPagination={columnPagination}
        dataset={dataset}
        downloadDataUrl={downloadDataUrl}
        downloadMetaDataUrl={downloadMetaDataUrl}
        queryKey={queryKey}
        rowPagination={rowPagination}
      />
    );
  }
});

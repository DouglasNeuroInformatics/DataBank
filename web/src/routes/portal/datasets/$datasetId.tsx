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

export const Route = createFileRoute('/portal/datasets/$datasetId')({
  validateSearch: zodValidator($ViewOneDatasetPageSearchParams),
  loaderDeps: ({ search: { columnPagination, rowPagination } }) => ({ columnPagination, rowPagination }),
  loader: async ({ deps: { columnPagination, rowPagination }, params }) => {
    const dataQueryUrl = `/v1/datasets/${params.datasetId}`;

    const viewOneDatasetOptions = queryOptions({
      queryFn: async () => {
        const response = await axios.post<$TabularDataset>(dataQueryUrl, {
          columnPagination,
          rowPagination
        });
        return $TabularDataset.parse(response.data);
      },
      queryKey: ['dataset-query', params.datasetId, columnPagination, rowPagination]
    });

    await queryClient.ensureQueryData(viewOneDatasetOptions);
  },
  component: () => {
    const { columnPagination, rowPagination } = useSearch({ from: '/portal/datasets/$datasetId' });
    const params = useParams({ from: '/portal/datasets/$datasetId' });
    const dataQueryUrl = `/v1/datasets/${params.datasetId}`;
    const downloadDataUrl = `/v1/datasets/download-data/`;
    const downloadMetaDataUrl = `/v1/datasets/download-metadata/`;
    const viewOneDatasetOptions = queryOptions({
      queryFn: async () => {
        const response = await axios.post<$TabularDataset>(dataQueryUrl, {
          columnPagination,
          rowPagination
        });
        return $TabularDataset.parse(response.data);
      },
      queryKey: ['dataset-query', params.datasetId, columnPagination, rowPagination]
    });
    const datasetQuery = useSuspenseQuery(viewOneDatasetOptions);
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

import { $TabularDataset } from '@databank/core';
import type { $DatasetViewPagination } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

export const DATASET_QUERY_KEY = 'dataset';

export const datasetQueryOptions = (
  datasetId: string,
  columnPagination: $DatasetViewPagination,
  rowPagination: $DatasetViewPagination
) => {
  return queryOptions({
    queryFn: async () => {
      const response = await axios.post<$TabularDataset>(`/v1/datasets/${datasetId}`, {
        columnPagination,
        rowPagination
      });
      return $TabularDataset.parse(response.data);
    },
    queryKey: [DATASET_QUERY_KEY, datasetId, { columnPagination, rowPagination }]
  });
};

export function useDatasetQuery(...args: Parameters<typeof datasetQueryOptions>) {
  return useSuspenseQuery(datasetQueryOptions(...args));
}

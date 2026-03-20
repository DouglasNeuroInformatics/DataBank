import { $TabularDataset } from '@databank/core';
import type { $DatasetViewPagination } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

export const PUBLIC_DATASET_QUERY_KEY = 'public-dataset';

export const publicDatasetQueryOptions = (
  datasetId: string,
  columnPagination: $DatasetViewPagination,
  rowPagination: $DatasetViewPagination
) => {
  return queryOptions({
    queryFn: async () => {
      const response = await axios.post<$TabularDataset>(`/v1/datasets/public/${datasetId}`, {
        columnPagination,
        rowPagination
      });
      return $TabularDataset.parse(response.data);
    },
    queryKey: [PUBLIC_DATASET_QUERY_KEY, datasetId, { columnPagination, rowPagination }]
  });
};

export function usePublicDatasetQuery(...args: Parameters<typeof publicDatasetQueryOptions>) {
  return useSuspenseQuery(publicDatasetQueryOptions(...args));
}

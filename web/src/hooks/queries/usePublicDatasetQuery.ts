import { $TabularDataset } from '@databank/core';
import type { $DatasetViewPagination } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

export const publicDatasetQueryOptions = (
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
      `public-dataset-query-${datasetId}-colPage-${columnPagination.currentPage}-colItems-${columnPagination.itemsPerPage}-rowPage-${rowPagination.currentPage}-rowItems-${rowPagination.itemsPerPage}`
    ]
  });
};

export function usePublicDatasetQuery(...args: Parameters<typeof publicDatasetQueryOptions>) {
  return useSuspenseQuery(publicDatasetQueryOptions(...args));
}

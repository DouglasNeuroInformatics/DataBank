import { $TabularDataset } from '@databank/core';
import type { $DatasetViewPagination } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

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
    queryKey: [
      `dataset-query-${datasetId}-colPage-${columnPagination.currentPage}-colItems-${columnPagination.itemsPerPage}-rowPage-${rowPagination.currentPage}-rowItems-${rowPagination.itemsPerPage}`
    ]
  });
};

export function useDatasetQuery(...args: Parameters<typeof datasetQueryOptions>) {
  return useSuspenseQuery(datasetQueryOptions(...args));
}

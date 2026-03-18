import { $TabularDataset } from '@databank/core';
import type { $DatasetViewPagination } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

export const PROJECT_DATASET_QUERY_KEY = 'project-dataset';

export const projectDatasetQueryOptions = (
  projectId: string,
  datasetId: string,
  columnPagination: $DatasetViewPagination,
  rowPagination: $DatasetViewPagination
) => {
  return queryOptions({
    queryFn: async () => {
      const response = await axios.post(`/v1/projects/dataset/${projectId}/${datasetId}`, {
        columnPaginationDto: columnPagination,
        rowPaginationDto: rowPagination
      });
      return $TabularDataset.parse(response.data);
    },
    queryKey: [PROJECT_DATASET_QUERY_KEY, projectId, datasetId, { columnPagination, rowPagination }]
  });
};

export function useProjectDatasetQuery(...args: Parameters<typeof projectDatasetQueryOptions>) {
  return useSuspenseQuery(projectDatasetQueryOptions(...args));
}

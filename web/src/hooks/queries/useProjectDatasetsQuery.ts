import type { $DatasetCardProps } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

export const PROJECT_DATASETS_QUERY_KEY = 'project-datasets';

export const projectDatasetsQueryOptions = (projectId: string) => {
  return queryOptions({
    queryFn: async () => {
      const response = await axios.get<$DatasetCardProps[]>(`/v1/projects/datasets/${projectId}`);
      return response.data;
    },
    queryKey: [PROJECT_DATASETS_QUERY_KEY, projectId]
  });
};

export function useProjectDatasetsQuery(projectId: string) {
  return useSuspenseQuery(projectDatasetsQueryOptions(projectId));
}

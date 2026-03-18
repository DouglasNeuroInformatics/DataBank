import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod/v4';

export const PROJECT_IS_MANAGER_QUERY_KEY = 'project-is-manager';

export const projectIsManagerQueryOptions = (projectId: string) => {
  return queryOptions({
    queryFn: async () => {
      const response = await axios.get(`/v1/projects/is-manager/${projectId}`);
      return z.boolean().parse(response.data);
    },
    queryKey: [PROJECT_IS_MANAGER_QUERY_KEY, projectId]
  });
};

export function useProjectIsManagerQuery(projectId: string) {
  return useSuspenseQuery(projectIsManagerQueryOptions(projectId));
}

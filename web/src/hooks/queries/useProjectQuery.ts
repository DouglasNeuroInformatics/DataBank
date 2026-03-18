import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod/v4';

const $Project = z.object({
  createdAt: z.coerce.date(),
  datasets: z.array(z.string()),
  description: z.string(),
  expiry: z.coerce.date(),
  externalId: z.string(),
  id: z.string(),
  name: z.string(),
  updatedAt: z.coerce.date(),
  userIds: z.array(z.string())
});

export type Project = z.infer<typeof $Project>;

export const PROJECT_QUERY_KEY = 'project';

export const projectQueryOptions = (projectId: string) => {
  return queryOptions({
    queryFn: async () => {
      const response = await axios.get(`/v1/projects/${projectId}`);
      return $Project.parse(response.data);
    },
    queryKey: [PROJECT_QUERY_KEY, projectId]
  });
};

export function useProjectQuery(projectId: string) {
  return useSuspenseQuery(projectQueryOptions(projectId));
}

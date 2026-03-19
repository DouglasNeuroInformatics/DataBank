import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod/v4';

// TODO - this needs to be synced correctly with the backend
const $Project = z.object({
  createdAt: z.coerce.date(),
  datasets: z.array(z.string()),
  description: z.string().nullish(),
  expiry: z.coerce.date(),
  externalId: z.string().nullish(),
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

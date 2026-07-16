import { parseISODate } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod/v4';

// TODO - this needs to be synced correctly with the backend
const $Project = z.object({
  createdAt: z.union([z.iso.datetime(), z.iso.date()]).transform(parseISODate),
  datasets: z.array(z.any()),
  description: z.string().nullish(),
  expiry: z.union([z.iso.datetime(), z.iso.date()]).transform(parseISODate),
  externalId: z.string().nullish(),
  id: z.string(),
  name: z.string(),
  updatedAt: z.union([z.iso.datetime(), z.iso.date()]).transform(parseISODate),
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

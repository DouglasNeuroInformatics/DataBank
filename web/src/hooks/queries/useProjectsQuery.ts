import { $ProjectInfo } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod/v4';

export const PROJECTS_QUERY_KEY = 'projects';

export const projectsQueryOptions = () => {
  return queryOptions({
    queryFn: async () => {
      const response = await axios.get('/v1/projects');
      return z.array($ProjectInfo).parse(response.data);
    },
    queryKey: [PROJECTS_QUERY_KEY]
  });
};

export function useProjectsQuery() {
  return useSuspenseQuery(projectsQueryOptions());
}

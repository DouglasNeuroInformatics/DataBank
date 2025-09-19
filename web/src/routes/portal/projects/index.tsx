import { $ProjectInfo } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import z from 'zod/v4';

import { ViewProjectsPage } from '@/features/projects/pages/ViewProjectsPage';
import { queryClient } from '@/services/react-query';

const viewProjectsQueryOptions = queryOptions({
  queryFn: async () => {
    const response = await axios.get<$ProjectInfo[]>('/v1/projects');
    return z.array($ProjectInfo).parse(response.data);
  },
  queryKey: ['projects']
});

export const Route = createFileRoute('/portal/projects/')({
  component: () => {
    const { data } = useSuspenseQuery(viewProjectsQueryOptions);
    return <ViewProjectsPage projectsInfoArray={data} />;
  },
  loader: () => queryClient.ensureQueryData(viewProjectsQueryOptions)
});

import { $Summary } from '@databank/core';
import { keepPreviousData, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';

import { DashboardPage } from '@/features/dashboard';
import { queryClient } from '@/services/react-query';

const dashboardSummaryQueryOptions = queryOptions({
  placeholderData: keepPreviousData,
  queryFn: async () => {
    const response = await axios.get('/v1/projects/dashboard-summary');
    return $Summary.parse(response.data);
  },
  queryKey: ['summary']
});

export const Route = createFileRoute('/portal/dashboard/')({
  component: () => {
    const { data } = useSuspenseQuery(dashboardSummaryQueryOptions);
    return <DashboardPage {...data} />;
  },
  loader: () => queryClient.ensureQueryData(dashboardSummaryQueryOptions)
});

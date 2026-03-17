import { $Summary } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

export const DASHBOARD_SUMMARY_QUERY_KEY = 'dashboard-summary';

export const dashboardSummaryQueryOptions = () => {
  return queryOptions({
    queryFn: async () => {
      const response = await axios.get('/v1/projects/dashboard-summary');
      return $Summary.parse(response.data);
    },
    queryKey: [DASHBOARD_SUMMARY_QUERY_KEY]
  });
};

export function useDashboardSummaryQuery() {
  return useSuspenseQuery(dashboardSummaryQueryOptions());
}

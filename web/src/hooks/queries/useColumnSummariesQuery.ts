import type { $ProjectColumnSummary } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

export const COLUMN_SUMMARIES_QUERY_KEY = 'column-summaries';

export const columnSummariesQueryOptions = (datasetId: string) => {
  return queryOptions({
    queryFn: async () => {
      const response = await axios.get<$ProjectColumnSummary[]>(`/v1/datasets/columns/${datasetId}`);
      return response.data;
    },
    queryKey: [COLUMN_SUMMARIES_QUERY_KEY, datasetId]
  });
};

export function useColumnSummariesQuery(datasetId: string) {
  return useSuspenseQuery(columnSummariesQueryOptions(datasetId));
}

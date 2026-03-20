import type { $DatasetCardProps } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

export const OWNED_DATASETS_QUERY_KEY = 'owned-datasets';

export const ownedDatasetsQueryOptions = () => {
  return queryOptions({
    queryFn: async () => {
      const response = await axios.get<$DatasetCardProps[]>('/v1/datasets/owned-by');
      return response.data;
    },
    queryKey: [OWNED_DATASETS_QUERY_KEY]
  });
};

export function useOwnedDatasetsQuery() {
  return useSuspenseQuery(ownedDatasetsQueryOptions());
}

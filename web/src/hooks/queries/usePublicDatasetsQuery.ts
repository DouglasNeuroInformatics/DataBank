import { $DatasetInfo } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod/v4';

export const PUBLIC_DATASETS_QUERY_KEY = 'public-datasets';

export const publicDatasetsQueryOptions = () => {
  return queryOptions({
    queryFn: async () => {
      const response = await axios.get('/v1/datasets/public');
      return z.array($DatasetInfo).parse(response.data);
    },
    queryKey: [PUBLIC_DATASETS_QUERY_KEY]
  });
};

export function usePublicDatasetsQuery() {
  return useSuspenseQuery(publicDatasetsQueryOptions());
}

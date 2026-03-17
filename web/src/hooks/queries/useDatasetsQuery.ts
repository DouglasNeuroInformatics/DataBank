import { $DatasetInfo } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod/v4';

export const DATASETS_QUERY_KEY = 'datasets-info';

export const datasetsQueryOptions = () => {
  return queryOptions({
    queryFn: async () => {
      const response = await axios.get('/v1/datasets');
      return z.array($DatasetInfo).parse(response.data);
    },
    queryKey: [DATASETS_QUERY_KEY]
  });
};

export function useDatasetsQuery() {
  return useSuspenseQuery(datasetsQueryOptions());
}

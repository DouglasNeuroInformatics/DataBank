import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod/v4';

const $Summary = z.object({
  datasetCounts: z.number().int().min(0),
  projectCounts: z.number().int().min(0)
});

export const useSummaryQuery = () => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await axios.get('/v1/projects/dashboard-summary');
      return $Summary.parse(response.data);
    },
    queryKey: ['summary']
  });
};

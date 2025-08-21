import type { $DatasetCardProps } from '@databank/core';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useDatasetsQuery = () => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await axios.get<$DatasetCardProps[]>('/v1/datasets');
      return response.data;
    },
    queryKey: ['datasets-info']
  });
};

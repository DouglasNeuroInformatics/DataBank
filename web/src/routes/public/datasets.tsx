import { $DatasetInfo } from '@databank/core';
import { keepPreviousData, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import z from 'zod/v4';

import { ViewDatasetsPage } from '@/features/dataset/pages/ViewDatasetsPage';
import { queryClient } from '@/services/react-query';

const viewPublicDatasetsQueryOptions = queryOptions({
  placeholderData: keepPreviousData,
  queryFn: async () => {
    const response = await axios.get<$DatasetInfo[]>('/v1/datasets/public');
    return z.array($DatasetInfo).parse(response.data);
  },
  queryKey: ['public-datasets-info']
});

export const Route = createFileRoute('/public/datasets')({
  component: () => {
    const { data } = useSuspenseQuery(viewPublicDatasetsQueryOptions);
    return <ViewDatasetsPage datasetsInfoArray={data} isPublic={true} />;
  },
  loader: () => queryClient.ensureQueryData(viewPublicDatasetsQueryOptions)
});

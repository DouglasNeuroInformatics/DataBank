import { $DatasetInfo } from '@databank/core';
import { keepPreviousData, queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import z from 'zod/v4';

import { ViewDatasetsPage } from '@/features/dataset/pages/ViewDatasetsPage';
import { queryClient } from '@/services/react-query';

const viewDatasetsQueryOptions = queryOptions({
  placeholderData: keepPreviousData,
  queryFn: async () => {
    const response = await axios.get<$DatasetInfo[]>('/v1/datasets');
    return z.array($DatasetInfo).parse(response.data);
  },
  queryKey: ['datasets-info']
});

export const Route = createFileRoute('/portal/datasets/')({
  component: () => {
    const { data } = useSuspenseQuery(viewDatasetsQueryOptions);
    return <ViewDatasetsPage datasetsInfoArray={data} isPublic={false} />;
  },
  loader: () => queryClient.ensureQueryData(viewDatasetsQueryOptions)
});

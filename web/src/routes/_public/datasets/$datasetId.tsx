import { $DatasetViewPagination } from '@databank/core';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod/v4';

import { publicDatasetQueryOptions, usePublicDatasetQuery } from '@/hooks/queries/usePublicDatasetQuery';

const $ViewOneDatasetPageSearchParams = z.object({
  columnPagination: $DatasetViewPagination.default({ currentPage: 1, itemsPerPage: 10 }),
  rowPagination: $DatasetViewPagination.default({ currentPage: 1, itemsPerPage: 10 })
});

const RouteComponent = () => {
  const { columnPagination, rowPagination } = Route.useSearch();
  const { datasetId } = Route.useParams();

  usePublicDatasetQuery(datasetId, columnPagination, rowPagination);

  return null;
};

export const Route = createFileRoute('/_public/datasets/$datasetId')({
  component: RouteComponent,
  loaderDeps: ({ search: { columnPagination, rowPagination } }) => ({ columnPagination, rowPagination }),
  // eslint-disable-next-line perfectionist/sort-objects
  loader: async ({ deps: { columnPagination, rowPagination }, context, params }) => {
    await context.queryClient.ensureQueryData(
      publicDatasetQueryOptions(params.datasetId, columnPagination, rowPagination)
    );
  },
  validateSearch: zodValidator($ViewOneDatasetPageSearchParams)
});

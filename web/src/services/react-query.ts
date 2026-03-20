import { MutationCache, QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      throwOnError: true
    },
    queries: {
      staleTime: Infinity,
      throwOnError: true
    }
  },
  // TODO: temporary hack — invalidate all queries on any mutation success
  mutationCache: new MutationCache({
    onSuccess: () => {
      void queryClient.invalidateQueries();
    }
  })
});

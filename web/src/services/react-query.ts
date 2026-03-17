import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      throwOnError: true
    },
    queries: {
      staleTime: Infinity,
      throwOnError: true
    }
  }
});

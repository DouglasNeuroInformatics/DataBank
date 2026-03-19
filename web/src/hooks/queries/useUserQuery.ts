import type { User } from '@databank/core';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import axios from 'axios';

export const USER_QUERY_KEY = 'user';

export const userQueryOptions = (userId: string) => {
  return queryOptions({
    queryFn: async () => {
      const response = await axios.get<User>(`/v1/users/${userId}`);
      return response.data;
    },
    queryKey: [USER_QUERY_KEY, userId]
  });
};

export function useUserQuery(userId: string) {
  return useSuspenseQuery(userQueryOptions(userId));
}

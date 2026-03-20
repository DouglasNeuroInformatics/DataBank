import type { $AuthPayload, $LoginCredentials } from '@databank/core';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useLoginMutation() {
  return useMutation({
    mutationFn: (credentials: $LoginCredentials) => axios.post<$AuthPayload>('/v1/auth/login', credentials)
  });
}

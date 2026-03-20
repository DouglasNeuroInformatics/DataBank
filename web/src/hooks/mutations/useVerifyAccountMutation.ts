import type { $AuthPayload } from '@databank/core';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useVerifyAccountMutation() {
  return useMutation({
    mutationFn: (code: number) => axios.post<$AuthPayload>('/v1/auth/verify-account', { code })
  });
}

import type { $EmailConfirmationProcedureInfo } from '@databank/core';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useSendConfirmEmailCodeMutation() {
  return useMutation({
    mutationFn: () => axios.post<$EmailConfirmationProcedureInfo>('/v1/auth/confirm-email-code')
  });
}

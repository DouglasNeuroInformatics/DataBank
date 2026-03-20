import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useCreateAccountMutation() {
  return useMutation({
    mutationFn: (data: { email: string; firstName: string; lastName: string; password: string }) =>
      axios.post('/v1/auth/account', { ...data, datasetIds: [] })
  });
}

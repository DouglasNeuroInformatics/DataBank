import type { $SetupOptions } from '@databank/core';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { SETUP_STATE_QUERY_KEY } from '../queries/useSetupStateQuery';

export function useCreateSetupMutation() {
  const queryClient = useQueryClient();
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: (data: $SetupOptions) => axios.post('/v1/setup', data),
    onSuccess() {
      addNotification({ type: 'success' });
      void queryClient.invalidateQueries({ queryKey: [SETUP_STATE_QUERY_KEY] });
    }
  });
}

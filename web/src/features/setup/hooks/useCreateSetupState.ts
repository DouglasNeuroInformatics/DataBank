import { type SetupDto } from '@/../../packages/schemas/src/setup/setup';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export function useCreateSetupState() {
  const queryClient = useQueryClient();
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: (data: SetupDto) => axios.post('/v1/setup', data),
    onSuccess() {
      addNotification({ type: 'success' });
      void queryClient.invalidateQueries({ queryKey: ['setup-state'] });
    }
  });
}

import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useRemoveProjectUserMutation() {
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      axios.delete(`/v1/projects/remove-user/${projectId}/${userId}`),
    onSuccess() {
      addNotification({ type: 'success' });
    }
  });
}

import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useAddProjectUserMutation() {
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: ({ newUserEmail, projectId }: { newUserEmail: string; projectId: string }) =>
      axios.post(`/v1/projects/add-user/${projectId}`, { newUserEmail }),
    onSuccess() {
      addNotification({ type: 'success' });
    }
  });
}

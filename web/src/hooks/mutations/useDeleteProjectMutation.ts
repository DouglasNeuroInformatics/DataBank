import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useDeleteProjectMutation() {
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: (projectId: string) => axios.delete(`/v1/projects/${projectId}`),
    onSuccess(_, projectId) {
      addNotification({ message: `Project with Id ${projectId} has been deleted`, type: 'success' });
    }
  });
}

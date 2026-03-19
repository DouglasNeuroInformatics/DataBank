import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useCreateProjectMutation() {
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: (data: {
      datasets: string[];
      description?: string;
      expiry: Date;
      externalId?: string;
      name: string;
      userIds: string[];
    }) => axios.post('/v1/projects/create', data),
    onSuccess() {
      addNotification({ message: 'Project created successfully', type: 'success' });
    }
  });
}

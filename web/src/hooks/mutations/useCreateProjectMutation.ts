import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { PROJECTS_QUERY_KEY } from '@/hooks/queries/useProjectsQuery';

export function useCreateProjectMutation() {
  const addNotification = useNotificationsStore((store) => store.addNotification);
  const queryClient = useQueryClient();
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
      void queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      addNotification({ message: 'Project created successfully', type: 'success' });
    }
  });
}

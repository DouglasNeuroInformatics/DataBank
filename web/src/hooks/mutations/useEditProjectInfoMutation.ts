import type { $UpdateProject } from '@databank/core';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useEditProjectInfoMutation() {
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: ({ projectId, updateProjectDto }: { projectId: string; updateProjectDto: $UpdateProject }) =>
      axios.patch(`/v1/projects/update/${projectId}`, { updateProjectDto }),
    onSuccess() {
      addNotification({ message: 'Project Information Updated!', type: 'success' });
    }
  });
}

import type { $ProjectDataset } from '@databank/core';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useAddDatasetToProjectMutation() {
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: ({ projectDatasetDto, projectId }: { projectDatasetDto: $ProjectDataset; projectId: string }) =>
      axios.post(`/v1/projects/add-dataset/${projectId}`, { projectDatasetDto }),
    onSuccess(_, { projectDatasetDto, projectId }) {
      addNotification({
        message: `Added dataset ${projectDatasetDto.datasetId} to project ${projectId}`,
        type: 'success'
      });
    }
  });
}

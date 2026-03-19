import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useRemoveProjectDatasetMutation() {
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: ({ datasetId, projectId }: { datasetId: string; projectId: string }) =>
      axios.delete(`/v1/projects/remove-dataset/${projectId}/${datasetId}`),
    onSuccess() {
      addNotification({ type: 'success' });
    }
  });
}

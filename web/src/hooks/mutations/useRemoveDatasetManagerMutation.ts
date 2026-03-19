import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useRemoveDatasetManagerMutation() {
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: ({ datasetId, managerId }: { datasetId: string; managerId: string }) =>
      axios.delete(`/v1/datasets/managers/${datasetId}/${managerId}`),
    onSuccess() {
      addNotification({ type: 'success' });
    }
  });
}

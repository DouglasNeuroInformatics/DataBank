import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useAddDatasetManagerMutation() {
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: ({ datasetId, newManagerEmail }: { datasetId: string; newManagerEmail: string }) =>
      axios.post(`/v1/datasets/managers/${datasetId}`, { newManagerEmail }),
    onSuccess(_, { newManagerEmail }) {
      addNotification({ message: `Manager with email ${newManagerEmail} added`, type: 'success' });
    }
  });
}

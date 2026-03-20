import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { DATASETS_QUERY_KEY } from '../queries/useDatasetsQuery';

export function useDeleteDatasetMutation() {
  const queryClient = useQueryClient();
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: (datasetId: string) => axios.delete(`/v1/datasets/${datasetId}`),
    onSuccess(_, datasetId) {
      addNotification({ message: `Dataset ${datasetId} deleted`, type: 'success' });
      void queryClient.invalidateQueries({ queryKey: [DATASETS_QUERY_KEY] });
    }
  });
}

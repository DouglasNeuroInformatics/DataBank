import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { DATASET_QUERY_KEY } from '../queries/useDatasetQuery';
import { PROJECT_DATASET_QUERY_KEY } from '../queries/useProjectDatasetQuery';

export function useDeleteColumnMutation({ isProject }: { isProject: boolean }) {
  const queryClient = useQueryClient();
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: ({ columnId, datasetId }: { columnId: string; datasetId: string }) =>
      axios.delete(`/v1/datasets/column/${datasetId}/${columnId}`),
    onSuccess() {
      const key = isProject ? PROJECT_DATASET_QUERY_KEY : DATASET_QUERY_KEY;
      addNotification({ type: 'success' });
      void queryClient.invalidateQueries({ queryKey: [key] });
    }
  });
}

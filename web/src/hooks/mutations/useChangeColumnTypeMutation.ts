import type { $ColumnType } from '@databank/core';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { DATASET_QUERY_KEY } from '../queries/useDatasetQuery';
import { PROJECT_DATASET_QUERY_KEY } from '../queries/useProjectDatasetQuery';

export function useChangeColumnTypeMutation({ isProject }: { isProject: boolean }) {
  const queryClient = useQueryClient();
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: ({ columnId, datasetId, type }: { columnId: string; datasetId: string; type: $ColumnType }) =>
      axios.patch(`/v1/datasets/column-type/${datasetId}/${columnId}`, { kind: type }),
    onSuccess() {
      const key = isProject ? PROJECT_DATASET_QUERY_KEY : DATASET_QUERY_KEY;
      addNotification({ type: 'success' });
      void queryClient.invalidateQueries({ queryKey: [key] });
    }
  });
}

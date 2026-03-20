import type { $EditDatasetInfo } from '@databank/core';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export function useEditDatasetInfoMutation() {
  const addNotification = useNotificationsStore((store) => store.addNotification);
  return useMutation({
    mutationFn: ({ datasetId, editDatasetInfoDto }: { datasetId: string; editDatasetInfoDto: $EditDatasetInfo }) =>
      axios.patch(`/v1/datasets/info/${datasetId}`, { editDatasetInfoDto }),
    onSuccess() {
      addNotification({ message: 'Dataset Information Updated!', type: 'success' });
    }
  });
}

import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useDeleteDataset = () => {
  const notifications = useNotificationsStore();
  const queryClient = useQueryClient();

  const deleteDataset = (datasetId: string) => {
    axios
      .delete(`/v1/datasets/${datasetId}`)
      .then(() => {
        notifications.addNotification({
          message: `Dataset with Id ${datasetId} has been deleted`,
          type: 'success'
        });
        void queryClient.invalidateQueries({ queryKey: ['datasets-info'] });
      })
      .catch((error) => {
        console.error(error);
        notifications.addNotification({
          message: `Failed to delete dataset: ${error.response?.data?.message || 'Unknown error'}`,
          type: 'error'
        });
      });
  };

  return deleteDataset;
};

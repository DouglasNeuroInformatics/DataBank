import { isPlainObject } from '@douglasneuroinformatics/libjs';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useQueryClient } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';

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
        let message: string;
        if (isAxiosError(error) && isPlainObject(error.response?.data)) {
          message = String(error.response.data.message);
        } else {
          message = 'Unknown Error';
        }
        notifications.addNotification({
          message: `Failed to delete dataset: ${message}`,
          type: 'error'
        });
      });
  };

  return deleteDataset;
};

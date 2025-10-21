import { isPlainObject } from '@douglasneuroinformatics/libjs';
import { useDestructiveAction, useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import axios, { isAxiosError } from 'axios';

export const useDeleteDataset = () => {
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const queryClient = useQueryClient();
  const navigation = useNavigate();

  return useDestructiveAction((datasetId: string) => {
    axios
      .delete(`/v1/datasets/${datasetId}`)
      .then(() => {
        addNotification({
          message: `Dataset with Id ${datasetId} has been deleted`,
          type: 'success'
        });
        void queryClient.invalidateQueries({ queryKey: ['datasets-info'] });
        void navigation({
          to: '/portal/datasets'
        });
      })
      .catch((error) => {
        console.error(error);
        let message: string;
        if (isAxiosError(error) && isPlainObject(error.response?.data)) {
          message = String(error.response.data.message);
        } else {
          message = 'Unknown Error';
        }
        addNotification({
          message: `Failed to delete dataset: ${message}`,
          type: 'error'
        });
      });
  });
};

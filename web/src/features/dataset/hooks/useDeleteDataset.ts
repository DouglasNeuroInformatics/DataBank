import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';

export const useDeleteDataset = () => {
  const notifications = useNotificationsStore();
  const navigate = useNavigate();

  const deleteDataset = (datasetId: string) => {
    axios
      .delete(`/v1/datasets/${datasetId}`)
      .then(() => {
        notifications.addNotification({
          message: `Dataset with Id ${datasetId} has been deleted`,
          type: 'success'
        });
        void navigate({ to: '/portal/datasets' });
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

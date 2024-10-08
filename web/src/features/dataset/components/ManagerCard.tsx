import { useEffect, useState } from 'react';

import type { TUser } from '@databank/types';
import { Button } from '@douglasneuroinformatics/libui/components';
import { Card } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth-store';

type ManagerCardProps = {
  datasetId: string;
  isManager: boolean;
  managerId: string;
};

const ManagerCard = ({ datasetId, isManager, managerId }: ManagerCardProps) => {
  const { t } = useTranslation('common');
  const notifications = useNotificationsStore();
  const navigate = useNavigate();
  const [user, setUser] = useState<null | TUser>(null);
  const { currentUser } = useAuthStore();
  if (!currentUser) {
    throw new Error();
  }

  useEffect(() => {
    void axios.get<TUser>(`/v1/users/${managerId}`).then((response) => {
      setUser(response.data);
    });
  }, [datasetId, managerId]);

  const removeManager = (managerIdToRemove: string) => {
    axios
      .delete(`/v1/datasets/managers/${datasetId}/${managerId}`)
      .then(() => {
        notifications.addNotification({
          message: `User with Id ${managerIdToRemove} has been removed from the dataset`,
          type: 'success'
        });
        navigate(`/portal/datasets`);
      })
      .catch(console.error);
  };

  return (
    <>
      {user && (
        <Card className="my-3">
          <Card.Content>
            <ul>
              <li key={user.firstName}>
                {t('managerName')}: {user.firstName}
              </li>
              <li key={user.lastName}>
                {t('managerName')}: {user.lastName}
              </li>
              <li key={user.email}>
                {t('managerEmail')}: {user.email}
              </li>
            </ul>
          </Card.Content>
          <Card.Footer className="flex justify-between">
            {isManager && (
              <Button variant={'primary'} onClick={() => removeManager(managerId)}>
                {t('removeManager')}
              </Button>
            )}
          </Card.Footer>
        </Card>
      )}
    </>
  );
};

export default ManagerCard;

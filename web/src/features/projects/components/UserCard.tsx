import { useEffect, useState } from 'react';

import type { TUser } from '@databank/types';
import { Button } from '@douglasneuroinformatics/libui/components';
import { Card } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth-store';

type UserCardProps = {
  projectId: string;
  userId: string;
  userNumber: number;
};

const UserCard = ({ projectId, userId, userNumber }: UserCardProps) => {
  const { t } = useTranslation('common');
  const notifications = useNotificationsStore();
  const navigate = useNavigate();
  const [user, setUser] = useState<null | TUser>(null);
  const { currentUser } = useAuthStore();
  if (!currentUser) {
    throw new Error();
  }

  useEffect(() => {
    void axios.get<TUser>(`/v1/users/${userId}`).then((response) => {
      setUser(response.data);
    });
  }, [projectId, userId]);

  const removeManager = (userIdToRemove: string) => {
    axios
      .delete(`/v1/projects/remove-user/${projectId}/${userId}`)
      .then(() => {
        notifications.addNotification({
          message: `User with Id ${userIdToRemove} has been removed from the project`,
          type: 'success'
        });
        navigate(`/portal/project/${projectId}`);
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
                {t('userFirstName')}: {user.firstName}
              </li>
              <li key={user.lastName}>
                {t('userLastName')}: {user.lastName}
              </li>
              <li key={user.email}>
                {t('userEmail')}: {user.email}
              </li>
            </ul>
          </Card.Content>
          <Card.Footer className="flex justify-between">
            <Button disabled={userNumber == 1} variant={'primary'} onClick={() => removeManager(userId)}>
              {t('removeUser')}
            </Button>
          </Card.Footer>
        </Card>
      )}
    </>
  );
};

export default UserCard;

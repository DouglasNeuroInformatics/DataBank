import { Form } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { type RouteObject, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import UserCard from '../components/UserCard';

const ManageProjectUsersPage = () => {
  const location = useLocation();
  const { t } = useTranslation('common');
  const { projectId, userIds } = location.state as {
    projectId: string;
    userIds: string[];
  };
  const notifications = useNotificationsStore();
  const navigate = useNavigate();

  const addManager = (userEmailToAdd: string) => {
    axios
      .post(`/v1/projects/add-user/${projectId}`, {
        newUserEmail: userEmailToAdd
      })
      .then(() => {
        notifications.addNotification({
          message: `User with Email ${userEmailToAdd} has been added to the current project`,
          type: 'success'
        });
        navigate(`/portal/project/${projectId}`);
      })
      .catch(console.error);
  };

  return (
    <>
      <Form
        content={{
          newManagerEmail: {
            kind: 'string',
            label: t('newManagerEmail'),
            variant: 'input'
          }
        }}
        submitBtnLabel={t('addManager')}
        validationSchema={z.object({
          newManagerEmail: z.string().email()
        })}
        onSubmit={(data) => {
          addManager(data.newManagerEmail);
        }}
      />
      <ul>
        {userIds.map((userId, i) => {
          return (
            <li key={i}>
              <UserCard projectId={projectId} userId={userId} userNumber={userIds.length} />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export const ManageProjectUsersRoute: RouteObject = {
  element: <ManageProjectUsersPage />,
  path: 'manageProjectUsers'
};

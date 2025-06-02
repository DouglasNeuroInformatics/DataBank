import { Form } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { z } from 'zod';

import UserCard from '../components/UserCard';

const ManageProjectUsersPage = () => {
  const route = getRouteApi('/portal/projects/manage-users');
  const { projectId, userIds } = route.useSearch();
  const { t } = useTranslation('common');

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
        void navigate({ to: `/portal/project/${projectId}` });
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

export { ManageProjectUsersPage };

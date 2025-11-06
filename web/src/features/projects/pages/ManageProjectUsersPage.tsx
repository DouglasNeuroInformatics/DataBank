import { Form } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { getRouteApi, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { z } from 'zod/v4';

import UserCard from '../components/UserCard';

const ManageProjectUsersPage = () => {
  const route = getRouteApi('/portal/projects/manage-users');
  const { projectId, userIds } = route.useSearch();
  const { t } = useTranslation('common');

  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();

  const addProjectUser = (userEmailToAdd: string) => {
    axios
      .post(`/v1/projects/add-user/${projectId}/${encodeURIComponent(userEmailToAdd)}`)
      .then(() => {
        addNotification({
          message: `User with Email ${userEmailToAdd} has been added to the current project`,
          type: 'success'
        });
        void navigate({ to: `/portal/projects/${projectId}` });
      })
      .catch((error) => {
        console.error(error);
        addNotification({
          message: t('addProjectUserFailure'),
          type: 'error'
        });
      });
  };

  return (
    <>
      <Form
        content={{
          newManagerEmail: {
            kind: 'string',
            label: t('newProjectUserEmail'),
            variant: 'input'
          }
        }}
        submitBtnLabel={t('addUser')}
        validationSchema={z.object({
          newManagerEmail: z.email()
        })}
        onSubmit={(data) => {
          addProjectUser(data.newManagerEmail);
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

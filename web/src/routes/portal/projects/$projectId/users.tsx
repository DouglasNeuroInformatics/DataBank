import { useEffect, useState } from 'react';

import type { User } from '@databank/core';
import { Button, Card, Form, Separator } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { ArrowLeftIcon, MailIcon, TrashIcon, UserCircleIcon } from 'lucide-react';
import { z } from 'zod/v4';

import { PageHeading } from '@/components/PageHeading';

const UserCard = ({ projectId, userId, userNumber }: { projectId: string; userId: string; userNumber: number }) => {
  const { t } = useTranslation('common');
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    void axios.get<User>(`/v1/users/${userId}`).then((response) => {
      setUser(response.data);
    });
  }, [projectId, userId]);

  const removeUser = (userIdToRemove: string) => {
    axios
      .delete(`/v1/projects/remove-user/${projectId}/${userId}`)
      .then(() => {
        addNotification({
          message: `User with Id ${userIdToRemove} has been removed from the project`,
          type: 'success'
        });
        void navigate({ params: { projectId }, to: '/portal/projects/$projectId' });
      })
      .catch(console.error);
  };

  if (!user) return null;

  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div className="bg-muted flex size-10 items-center justify-center rounded-full">
          <UserCircleIcon className="text-muted-foreground size-6" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <MailIcon className="size-3" />
            {user.email}
          </p>
        </div>
      </div>
      <Button disabled={userNumber === 1} size="sm" variant="danger" onClick={() => removeUser(userId)}>
        <TrashIcon className="mr-1.5 size-3.5" />
        {t('removeUser')}
      </Button>
    </div>
  );
};

const RouteComponent = () => {
  const { projectId } = Route.useParams();
  const { userIds } = Route.useSearch();
  const { t } = useTranslation('common');
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();

  const addUser = (email: string) => {
    axios
      .post(`/v1/projects/add-user/${projectId}`, { newUserEmail: email })
      .then(() => {
        addNotification({
          message: `User with Email ${email} has been added to the current project`,
          type: 'success'
        });
        void navigate({ params: { projectId }, to: '/portal/projects/$projectId' });
      })
      .catch(console.error);
  };

  return (
    <div>
      <PageHeading
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => void navigate({ params: { projectId }, to: '/portal/projects/$projectId' })}
          >
            <ArrowLeftIcon className="mr-1.5 size-3.5" />
            {t({
              en: 'Back to Project',
              fr: 'Retour au projet'
            })}
          </Button>
        }
        description={t({
          en: 'Add or remove users from this project.',
          fr: 'Ajouter ou supprimer des utilisateurs de ce projet.'
        })}
      >
        {t('manageProjectUsers')}
      </PageHeading>

      <Card className="mb-6">
        <Card.Header>
          <Card.Title className="text-base">
            {t({
              en: 'Add User',
              fr: 'Ajouter un utilisateur'
            })}
          </Card.Title>
        </Card.Header>
        <Card.Content>
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
            onSubmit={(data) => addUser(data.newManagerEmail)}
          />
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title className="text-base">
            {t({
              en: 'Current Users',
              fr: 'Utilisateurs actuels'
            })}
          </Card.Title>
          <Card.Description>
            {userIds.length} {userIds.length === 1 ? 'user' : 'users'}
          </Card.Description>
        </Card.Header>
        <Separator />
        <Card.Content className="space-y-3 pt-4">
          {userIds.map((userId) => (
            <UserCard key={userId} projectId={projectId} userId={userId} userNumber={userIds.length} />
          ))}
        </Card.Content>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/portal/projects/$projectId/users')({
  component: RouteComponent,
  validateSearch: z.object({
    userIds: z.string().array()
  })
});

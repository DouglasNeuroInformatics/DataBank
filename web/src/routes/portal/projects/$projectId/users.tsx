import { Button, Card, Form, Separator } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { ArrowLeftIcon } from 'lucide-react';
import { z } from 'zod/v4';

import { PageHeading } from '@/components/PageHeading';
import { UserInfoCard } from '@/components/UserInfoCard';

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
        addNotification({ type: 'success' });
        void navigate({ params: { projectId }, to: '/portal/projects/$projectId' });
      })
      .catch(console.error);
  };

  const removeUser = (userId: string) => {
    axios
      .delete(`/v1/projects/remove-user/${projectId}/${userId}`)
      .then(() => {
        addNotification({ type: 'success' });
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
              newUserEmail: {
                kind: 'string',
                label: t({
                  en: 'User Email',
                  fr: "Courriel de l'utilisateur"
                }),
                variant: 'input'
              }
            }}
            submitBtnLabel={t({
              en: 'Add User',
              fr: 'Ajouter un utilisateur'
            })}
            validationSchema={z.object({
              newUserEmail: z.string().email()
            })}
            onSubmit={(data) => addUser(data.newUserEmail)}
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
            <UserInfoCard
              actionLabel={t('removeUser')}
              canRemove={userIds.length > 1}
              key={userId}
              userId={userId}
              onRemove={() => removeUser(userId)}
            />
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

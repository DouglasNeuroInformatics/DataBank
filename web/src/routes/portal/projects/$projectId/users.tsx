import { Button, Card, Form, Separator } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { z } from 'zod/v4';

import { PageHeading } from '@/components/PageHeading';
import { UserInfoCard } from '@/components/UserInfoCard';
import { useAddProjectUserMutation } from '@/hooks/mutations/useAddProjectUserMutation';
import { useRemoveProjectUserMutation } from '@/hooks/mutations/useRemoveProjectUserMutation';
import { userQueryOptions } from '@/hooks/queries/useUserQuery';

const RouteComponent = () => {
  const { projectId } = Route.useParams();
  const { userIds } = Route.useSearch();
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const addUserMutation = useAddProjectUserMutation();
  const removeUserMutation = useRemoveProjectUserMutation();

  const addUser = (email: string) => {
    addUserMutation.mutate(
      { newUserEmail: email, projectId },
      {
        onSuccess() {
          void navigate({ params: { projectId }, to: '/portal/projects/$projectId' });
        }
      }
    );
  };

  const removeUser = (userId: string) => {
    removeUserMutation.mutate(
      { projectId, userId },
      {
        onSuccess() {
          void navigate({ params: { projectId }, to: '/portal/projects/$projectId' });
        }
      }
    );
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
  loaderDeps: ({ search }) => ({ userIds: search.userIds }),
  // eslint-disable-next-line perfectionist/sort-objects
  loader: async ({ context, deps }) => {
    await Promise.all(deps.userIds.map((id) => context.queryClient.ensureQueryData(userQueryOptions(id))));
  },
  validateSearch: z.object({
    userIds: z.string().array()
  })
});

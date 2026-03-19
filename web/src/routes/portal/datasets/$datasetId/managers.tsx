import { Button, Card, Form, Separator } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { z } from 'zod/v4';

import { PageHeading } from '@/components/PageHeading';
import { UserInfoCard } from '@/components/UserInfoCard';
import { useAddDatasetManagerMutation } from '@/hooks/mutations/useAddDatasetManagerMutation';
import { useRemoveDatasetManagerMutation } from '@/hooks/mutations/useRemoveDatasetManagerMutation';
import { userQueryOptions } from '@/hooks/queries/useUserQuery';

const RouteComponent = () => {
  const { datasetId } = Route.useParams();
  const { isManager, managerIds } = Route.useSearch();
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const addManagerMutation = useAddDatasetManagerMutation();
  const removeManagerMutation = useRemoveDatasetManagerMutation();

  const addManager = (email: string) => {
    addManagerMutation.mutate(
      { datasetId, newManagerEmail: email },
      {
        onSuccess() {
          void navigate({ params: { datasetId }, to: '/portal/datasets/$datasetId' });
        }
      }
    );
  };

  const removeManager = (managerId: string) => {
    removeManagerMutation.mutate(
      { datasetId, managerId },
      {
        onSuccess() {
          void navigate({ to: '/portal/datasets' });
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
            onClick={() => void navigate({ params: { datasetId }, to: '/portal/datasets/$datasetId' })}
          >
            <ArrowLeftIcon className="mr-1.5 size-3.5" />
            {t({
              en: 'Back to Dataset',
              fr: 'Retour au jeu de données'
            })}
          </Button>
        }
        description={t({
          en: 'Add or remove managers for this dataset.',
          fr: 'Ajouter ou supprimer des gestionnaires pour ce jeu de données.'
        })}
      >
        {t('manageDatasetManagers')}
      </PageHeading>

      {isManager && (
        <Card className="mb-6">
          <Card.Header>
            <Card.Title className="text-base">
              {t({
                en: 'Add Manager',
                fr: 'Ajouter un gestionnaire'
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
              onSubmit={(data) => addManager(data.newManagerEmail)}
            />
          </Card.Content>
        </Card>
      )}

      <Card>
        <Card.Header>
          <Card.Title className="text-base">
            {t({
              en: 'Current Managers',
              fr: 'Gestionnaires actuels'
            })}
          </Card.Title>
          <Card.Description>
            {managerIds.length} {managerIds.length === 1 ? 'manager' : 'managers'}
          </Card.Description>
        </Card.Header>
        <Separator />
        <Card.Content className="space-y-3 pt-4">
          {managerIds.map((managerId) => (
            <UserInfoCard
              actionLabel={t('removeManager')}
              canRemove={isManager}
              key={managerId}
              userId={managerId}
              onRemove={() => removeManager(managerId)}
            />
          ))}
        </Card.Content>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/portal/datasets/$datasetId/managers')({
  component: RouteComponent,
  loaderDeps: ({ search }) => ({ managerIds: search.managerIds }),
  // eslint-disable-next-line perfectionist/sort-objects
  loader: async ({ context, deps }) => {
    await Promise.all(deps.managerIds.map((id) => context.queryClient.ensureQueryData(userQueryOptions(id))));
  },
  validateSearch: z.object({
    isManager: z.boolean(),
    managerIds: z.string().array().min(1)
  })
});

/* eslint-disable perfectionist/sort-objects */

import { Form, Spinner } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod/v4';

import { PageHeading } from '@/components/PageHeading';
import { useCreateProjectMutation } from '@/hooks/mutations/useCreateProjectMutation';
import { useAppStore } from '@/store';

const $CreateProjectFormValidation = z.object({
  externalId: z.string().optional(),
  description: z.string().optional(),
  expiry: z.date().min(new Date()),
  name: z.string().min(1)
});

const RouteComponent = () => {
  const currentUser = useAppStore((s) => s.auth.ctx.currentUser);
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const createProjectMutation = useCreateProjectMutation();

  const createProject = (data: z.infer<typeof $CreateProjectFormValidation>) => {
    createProjectMutation.mutate(
      {
        datasets: [],
        userIds: [currentUser?.id ?? ''],
        ...data
      },
      {
        onSuccess() {
          void navigate({ to: '/portal/projects' });
        }
      }
    );
  };

  return (
    <div className="mx-auto max-w-xl">
      <PageHeading centered>
        {t({
          en: 'Create New Project',
          fr: 'Créer un nouveau projet'
        })}
      </PageHeading>
      {createProjectMutation.isPending ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner />
          <p className="text-muted-foreground mt-4 text-sm">
            {t({
              en: 'Creating project...',
              fr: 'Création du projet...'
            })}
          </p>
        </div>
      ) : (
        <Form
          content={{
            name: { kind: 'string', label: t('projectName'), variant: 'input' },
            description: { kind: 'string', label: t('projectDescription'), variant: 'textarea' },
            externalId: {
              kind: 'string',
              label: t('projectExternalId'),
              description: t('projectExternalIdDescription'),
              variant: 'input'
            },
            expiry: { kind: 'date', label: t('projectExpiry') }
          }}
          submitBtnLabel="Confirm"
          validationSchema={$CreateProjectFormValidation}
          onSubmit={(data) => createProject(data)}
        />
      )}
    </div>
  );
};

export const Route = createFileRoute('/portal/projects/create')({
  component: RouteComponent
});

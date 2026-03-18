/* eslint-disable perfectionist/sort-objects */
import { useState } from 'react';

import { Form, Spinner } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { z } from 'zod/v4';

import { PageHeading } from '@/components/PageHeading';
import { useAppStore } from '@/store';

const $CreateProjectFormValidation = z.object({
  externalId: z.string().optional(),
  description: z.string().optional(),
  expiry: z.date().min(new Date()),
  name: z.string().min(1)
});

const RouteComponent = () => {
  const currentUser = useAppStore((s) => s.auth.ctx.currentUser);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createProject = async (data: z.infer<typeof $CreateProjectFormValidation>) => {
    setIsSubmitting(true);
    await axios.post('/v1/projects/create', {
      datasets: [],
      userIds: [currentUser?.id],
      ...data
    });
    addNotification({ message: t('createProjectSuccess'), type: 'success' });
    void navigate({ to: '/portal/projects' });
  };

  return (
    <div className="mx-auto max-w-xl">
      <PageHeading centered>
        {t({
          en: 'Create New Project',
          fr: 'Créer un nouveau projet'
        })}
      </PageHeading>
      {isSubmitting ? (
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
          onSubmit={(data) => void createProject(data)}
        />
      )}
    </div>
  );
};

export const Route = createFileRoute('/portal/projects/create')({
  component: RouteComponent
});

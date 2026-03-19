/* eslint-disable perfectionist/sort-objects */
import { useCallback } from 'react';

import { $ISODate } from '@databank/core';
import type { $UpdateProject } from '@databank/core';
import { Button, Form } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { z } from 'zod/v4';

import { PageHeading } from '@/components/PageHeading';
import { useEditProjectInfoMutation } from '@/hooks/mutations/useEditProjectInfoMutation';

const $EditProjectInfoDto = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  externalId: z.string().optional(),
  expiry: z.date().min(new Date()).optional()
});

const $EditProjectInfoSearchParams = z.object({
  name: z.string(),
  description: z.string().optional(),
  externalId: z.string().optional(),
  expiryDate: $ISODate
});

const RouteComponent = () => {
  const { projectId } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { name, description, externalId, expiryDate } = Route.useSearch();
  const editProjectInfoMutation = useEditProjectInfoMutation();

  const handleSubmit = useCallback(
    (data: $UpdateProject) => {
      editProjectInfoMutation.mutate(
        { projectId, updateProjectDto: data },
        {
          onSuccess() {
            void navigate({ to: '/portal/projects/$projectId', params: { projectId } });
          }
        }
      );
    },
    [projectId]
  );

  return (
    <div className="mx-auto max-w-xl">
      <PageHeading
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => void navigate({ to: '/portal/projects/$projectId', params: { projectId } })}
          >
            <ArrowLeftIcon className="mr-1.5 size-3.5" />
            {t({
              en: 'Back to Project',
              fr: 'Retour au projet'
            })}
          </Button>
        }
      >
        {t('editProjectInfo')}
      </PageHeading>
      <Form
        content={{
          name: { kind: 'string', variant: 'input', label: t('newProjectName'), placeholder: name },
          description: {
            kind: 'string',
            variant: 'input',
            label: t('newProjectDescription'),
            placeholder: description
          },
          externalId: {
            kind: 'string',
            variant: 'input',
            label: t('newProjectExternalId'),
            description: t('projectExternalIdDescription'),
            placeholder: externalId
          },
          expiry: {
            kind: 'date',
            label: `${t('newProjectExpiryDate')} (Current: ${expiryDate.toISOString().split('T')[0]})`
          }
        }}
        resetBtn={true}
        validationSchema={$EditProjectInfoDto}
        onSubmit={(data) => handleSubmit(data)}
      />
    </div>
  );
};

export const Route = createFileRoute('/portal/projects/$projectId/edit')({
  validateSearch: $EditProjectInfoSearchParams,
  component: RouteComponent
});

/* eslint-disable perfectionist/sort-objects */
import { useCallback } from 'react';

import type { $UpdateProject } from '@databank/core';
import { Button, Form, Heading } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { z } from 'zod/v4';

const $EditProjectInfoDto = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  externalId: z.string().optional(),
  expiry: z.date().min(new Date()).optional()
});

const EditProjectInfoPage = () => {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const { t } = useTranslation('common');

  const { name, description, externalId, expiryDate } = useSearch({ from: '/portal/projects/edit-info/$projectId' });

  const handleSubmit = useCallback(
    (data: $UpdateProject) => {
      axios
        .patch(`/v1/projects/update/${params.projectId}`, {
          updateProjectDto: data
        })
        .then(() => {
          addNotification({ message: 'Project Information Updated!', type: 'success' });
          void navigate({ to: `/portal/projects/${params.projectId}` });
        })
        .catch(console.error);
    },
    [params.projectId]
  );

  return (
    <div className="mt-6 w-full space-y-40 sm:max-w-md">
      <div className="h-auto rounded-lg border-2 border-slate-300 p-6 text-slate-600 dark:border-slate-600 dark:text-slate-300">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{ opacity: 1 }}
            className="flex h-full flex-col items-center justify-center"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={'test'}
            transition={{ duration: 1 }}
          >
            <Heading className="m-4" variant="h3">
              {t('editProjectInfo')}
            </Heading>
            <Form
              content={{
                name: {
                  kind: 'string',
                  variant: 'input',
                  label: t('newProjectName'),
                  placeholder: name
                },
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
                  label: `${t('newProjectExpiryDate')} (Current Expiry: ${expiryDate.toISOString()})`
                }
              }}
              resetBtn={true}
              validationSchema={$EditProjectInfoDto}
              onSubmit={(data) => handleSubmit(data)}
            />
            <Button
              className="m-4 w-full"
              label="Back"
              variant={'secondary'}
              onClick={() => {
                void navigate({ to: `/portal/projects/${params.projectId}` });
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export { EditProjectInfoPage };

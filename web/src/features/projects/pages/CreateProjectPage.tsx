/* eslint-disable perfectionist/sort-objects */

import { useEffect, useState } from 'react';

import { Form } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { type RouteObject, useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { LoadingFallback } from '@/components';
import { useAuthStore } from '@/stores/auth-store';

const $CreateProjectFormValidation = z.object({
  externalId: z.string().optional(),
  description: z.string().optional(),
  expiry: z.date().min(new Date()),
  name: z.string().min(1)
});

export type CreateProjectprojectData = z.infer<typeof $CreateProjectFormValidation>;

const CreateProjectPage = () => {
  const { currentUser } = useAuthStore();
  const notifications = useNotificationsStore();
  const { t } = useTranslation('common');
  const navigate = useNavigate();

  const [projectData, setProjectData] = useState<CreateProjectprojectData | null>(null);

  useEffect(() => {
    if (projectData) {
      void createProject();
    }
  }, [projectData]);

  const createProject = async () => {
    await axios.post('/v1/projects/create', {
      datasets: [],
      ...projectData,
      userIds: [currentUser?.id]
    });
    notifications.addNotification({ message: t('createDatasetSuccess'), type: 'success' });
    navigate('/portal/projects');
  };

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="flex h-full flex-grow flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {projectData ? (
        <LoadingFallback />
      ) : (
        <div className="mt-6 w-full space-y-40 sm:max-w-md">
          <div className="h-auto rounded-lg border-2 border-dashed border-slate-300 p-6 text-slate-600 dark:border-slate-600 dark:text-slate-300">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{ opacity: 1 }}
                className="flex h-full flex-col items-center justify-center"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key={'test'}
                transition={{ duration: 1 }}
              >
                {
                  <Form
                    content={{
                      name: {
                        kind: 'string',
                        label: t('projectName'),
                        variant: 'input'
                      },
                      description: {
                        kind: 'string',
                        label: t('projectDescription'),
                        variant: 'textarea'
                      },
                      externalId: {
                        kind: 'string',
                        label: t('projectExternalId'),
                        variant: 'input'
                      },
                      expiry: {
                        kind: 'date',
                        label: t('projectExpiry')
                      }
                    }}
                    submitBtnLabel="Confirm"
                    validationSchema={$CreateProjectFormValidation}
                    onSubmit={(data) => {
                      setProjectData(data);
                    }}
                  />
                }
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const CreateProjectRoute: RouteObject = {
  element: <CreateProjectPage />,
  path: 'createProject'
};

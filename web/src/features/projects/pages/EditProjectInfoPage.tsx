/* eslint-disable perfectionist/sort-objects */
import React from 'react';

import type { EditProjectInfoDto } from '@databank/types';
import { Button, Form, Heading } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { type RouteObject, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

const $EditProjectInfoDto = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  externalId: z.string().optional(),
  expiry: z.date().min(new Date()).optional()
});

const EditProjectInfoPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const notifications = useNotificationsStore();

  const handleSubmit = (data: EditProjectInfoDto) => {
    axios
      .patch(`/v1/projects/update/${params.projectId}`, {
        updateProjectDto: data
      })
      .then(() => {
        notifications.addNotification({ message: 'Project Information Updated!', type: 'success' });
        navigate(-1);
      })
      .catch(console.error);
  };

  return (
    <div className="w-full mt-6 sm:max-w-md space-y-40">
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
              Edit Project Information
            </Heading>
            <Form
              content={{
                name: {
                  kind: 'string',
                  variant: 'input',
                  label: 'New Project Name'
                },
                description: {
                  kind: 'string',
                  variant: 'input',
                  label: 'New Project Description'
                },
                externalId: {
                  kind: 'string',
                  variant: 'input',
                  label: 'New External Id'
                },
                expiry: {
                  kind: 'date',
                  label: 'New Expiry Date'
                }
              }}
              resetBtn={true}
              validationSchema={$EditProjectInfoDto}
              onSubmit={(data) => handleSubmit(data)}
            />
            <Button
              className="w-full m-4"
              label="Back"
              variant={'secondary'}
              onClick={() => {
                navigate(-1);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export const EditProjectInfoRoute: RouteObject = {
  element: <EditProjectInfoPage />,
  path: 'project/edit-info/:projectId'
};

/* eslint-disable perfectionist/sort-objects */

import type { EditDatasetInfo } from '@databank/core';
import { Button, Form, Heading } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { z } from 'zod';

const $EditDatasetInfoDto = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  license: z.enum(['PUBLIC', 'OTHER']).optional(),
  permission: z.enum(['PUBLIC', 'LOGIN', 'VERIFIED', 'MANAGER']).optional()
});

const EditDatasetInfoPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const notifications = useNotificationsStore();

  const licenseOption = {
    PUBLIC: 'PUBLIC',
    OTHER: 'OTHER'
  };

  const permissionOption = {
    PUBLIC: 'PUBLIC',
    LOGIN: 'LOGIN',
    VERIFIED: 'VERIFIED',
    MANAGER: 'MANAGER'
  };

  const handleSubmit = (data: EditDatasetInfo) => {
    axios
      .patch(`/v1/datasets/info/${params.datasetId}`, {
        editDatasetInfoDto: data
      })
      .then(() => {
        notifications.addNotification({ message: 'Dataset Information Updated!', type: 'success' });
        navigate(-1);
      })
      .catch(console.error);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
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
                Edit Dataset Information
              </Heading>
              <Form
                content={{
                  name: {
                    kind: 'string',
                    variant: 'input',
                    label: 'New Dataset Name'
                  },
                  description: {
                    kind: 'string',
                    variant: 'input',
                    label: 'New Dataset Description'
                  },
                  license: {
                    kind: 'string',
                    variant: 'select',
                    options: licenseOption,
                    label: 'License'
                  },
                  permission: {
                    kind: 'string',
                    variant: 'select',
                    options: permissionOption,
                    label: 'Permission'
                  }
                }}
                resetBtn={true}
                validationSchema={$EditDatasetInfoDto}
                onSubmit={(data) => handleSubmit(data)}
              />
              <Button
                className="m-4 w-full"
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
    </div>
  );
};

export const editDatasetInfoRoute: RouteObject = {
  element: <EditDatasetInfoPage />,
  path: 'dataset/edit-info/:datasetId'
};

/* eslint-disable perfectionist/sort-objects */
import { $DatasetLicenses, $EditDatasetInfo, mostFrequentOpenSourceLicenses } from '@databank/core';
import { Button, Form, Heading } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate, useParams } from '@tanstack/react-router';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { z } from 'zod/v4';

import { useDebounceLicensesFilter } from '@/hooks/useDebounceLicensesFilter';

const $EditDatasetInfoDto = z.object({
  description: z.string().optional(),
  isOpenSource: z.boolean().optional(),
  license: $DatasetLicenses.optional(),
  name: z.string().optional(),
  permission: z.enum(['PUBLIC', 'LOGIN', 'VERIFIED', 'MANAGER']).optional(),
  searchLicenseString: z.string().optional()
});

const EditDatasetInfoPage = () => {
  const params = useParams({ strict: false });
  const navigate = useNavigate();
  const notifications = useNotificationsStore();
  const { t } = useTranslation('common');

  const debouncedLicensesFilter = useDebounceLicensesFilter();

  const permissionOption = {
    LOGIN: 'LOGIN',
    MANAGER: 'MANAGER',
    PUBLIC: 'PUBLIC',
    VERIFIED: 'VERIFIED'
  };

  const handleSubmit = (data: $EditDatasetInfo) => {
    axios
      .patch(`/v1/datasets/info/${params.datasetId}`, {
        editDatasetInfoDto: data
      })
      .then(() => {
        notifications.addNotification({ message: 'Dataset Information Updated!', type: 'success' });
        void navigate({ to: `/portal/datasets/${params.datasetId}` });
      })
      .catch(console.error);
  };

  return (
    <div className="flex w-full items-center justify-center">
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
              <Heading className="mb-4" variant="h2">
                {t('editDatasetInfo')}
              </Heading>
              <Form
                content={[
                  {
                    description: 'Basic dataset information details',
                    fields: {
                      name: {
                        kind: 'string',
                        label: 'New Dataset Name',
                        variant: 'input'
                      },
                      description: {
                        kind: 'string',
                        label: 'New Dataset Description',
                        variant: 'input'
                      },
                      permission: {
                        kind: 'string',
                        label: 'Permission',
                        options: permissionOption,
                        variant: 'select'
                      }
                    },
                    title: 'Basic Dataset Information'
                  },
                  {
                    description: 'Select a license for your dataset',
                    fields: {
                      isOpenSource: {
                        kind: 'boolean',
                        label: 'Is License Open Source',
                        variant: 'radio'
                      },
                      searchLicenseString: {
                        kind: 'string',
                        label: 'Search for licenses',
                        variant: 'input'
                      },
                      license: {
                        deps: ['searchLicenseString', 'isOpenSource'],
                        kind: 'dynamic',
                        render(data) {
                          return {
                            kind: 'string',
                            label: 'Select License',
                            options:
                              debouncedLicensesFilter(data.searchLicenseString?.toLowerCase(), data.isOpenSource) ??
                              mostFrequentOpenSourceLicenses,
                            variant: 'select'
                          };
                        }
                      }
                    },
                    title: 'Dataset License'
                  }
                ]}
                resetBtn={true}
                validationSchema={$EditDatasetInfoDto}
                onSubmit={(data) => handleSubmit(data)}
              />
              <Button
                className="m-4 w-full"
                label="Back"
                variant={'secondary'}
                onClick={() => {
                  void navigate({ to: `/portal/datasets/${params.datasetId}` });
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export { EditDatasetInfoPage };

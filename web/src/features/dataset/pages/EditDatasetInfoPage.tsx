/* eslint-disable perfectionist/sort-objects */
import {
  $DatasetLicenses,
  licensesArrayLowercase,
  mostFrequentOpenSourceLicenses,
  nonOpenSourceLicensesArray,
  openSourceLicensesArray
} from '@databank/core';
import type { EditDatasetInfo, LicenseWithLowercase } from '@databank/core';
import { Button, Form, Heading } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore } from '@douglasneuroinformatics/libui/hooks';
import { useNavigate, useParams } from '@tanstack/react-router';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useDebounceCallback } from 'usehooks-ts';
import { z } from 'zod';

const _filterLicenses = (
  searchString: string | undefined,
  isOpenSource: boolean | undefined
): { [key: string]: string } => {
  let filterLicensesArray: [string, LicenseWithLowercase][];
  if (isOpenSource === undefined) {
    filterLicensesArray = licensesArrayLowercase;
  } else {
    filterLicensesArray = isOpenSource ? openSourceLicensesArray : nonOpenSourceLicensesArray;
  }

  if (searchString !== undefined) {
    filterLicensesArray = filterLicensesArray.filter(
      ([_, license]) =>
        license.lowercaseLicenseId.includes(searchString) || license.lowercaseName.includes(searchString)
    );
  }

  return Object.fromEntries(
    filterLicensesArray.map(([key, value]) => {
      return [key, value.name];
    })
  );
};

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

  const debouncedLicensesFilter = useDebounceCallback(_filterLicenses, 200);

  const permissionOption = {
    LOGIN: 'LOGIN',
    MANAGER: 'MANAGER',
    PUBLIC: 'PUBLIC',
    VERIFIED: 'VERIFIED'
  };

  const handleSubmit = (data: EditDatasetInfo) => {
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
                Edit Dataset Information
              </Heading>
              <Form
                content={[
                  {
                    description: 'Basic dataset information details',
                    fields: {
                      description: {
                        kind: 'string',
                        label: 'New Dataset Description',
                        variant: 'input'
                      },
                      name: {
                        kind: 'string',
                        label: 'New Dataset Name',
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

/* eslint-disable perfectionist/sort-objects */

import type { SetupOptions } from '@databank/types';
import { Form } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';
import type { MergeDeep } from 'type-fest';
import { z } from 'zod';

type SetupData = MergeDeep<
  SetupOptions['admin'],
  {
    verificationRegex?: string;
    verificationType: SetupOptions['setupConfig']['verificationInfo']['kind'];
  }
>;

type SetupFormProps = {
  onSubmit: (data: SetupOptions) => void;
};

// Matches string with 8 or more characters, minimum one upper case, lowercase, and number
const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

export const SetupForm = ({ onSubmit }: SetupFormProps) => {
  const { t } = useTranslation();
  return (
    <Form<SetupData>
      content={[
        {
          description: t('setup.admin.description'),
          fields: {
            email: {
              kind: 'text',
              label: t('email'),
              variant: 'short'
            },
            firstName: {
              kind: 'text',
              label: t('firstName'),
              variant: 'short'
            },
            lastName: {
              kind: 'text',
              label: t('lastName'),
              variant: 'short'
            },
            password: {
              kind: 'text',
              label: t('password'),
              variant: 'password'
            }
          },
          title: t('setup.admin.title')
        },
        {
          description: 'Admin selects the method for user verification',
          fields: {
            verificationType: {
              kind: 'options',
              label: 'Verification Method',
              options: {
                MANUAL_VERIFICATION: 'Manually verify users by the admin',
                VERIFICATION_UPON_CONFIRM_EMAIL: 'Automatically verify users when they confirm their emails',
                VERIFICATION_WITH_REGEX: 'Verify users by matching their emails with a predefined regex'
              }
            },
            verificationRegex: {
              deps: ['verificationType'],
              kind: 'dynamic',
              render: (data) => {
                if (data?.verificationType === 'VERIFICATION_WITH_REGEX') {
                  return {
                    kind: 'text',
                    label: 'Regular expression',
                    variant: 'short'
                  };
                }
                return null;
              }
            }
          },
          title: 'User Verification Options'
        }
      ]}
      submitBtnLabel={t('submit')}
      validationSchema={z.object({
        email: z.string().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        password: z.string().regex(isStrongPassword),
        verificationRegex: z.string().optional(),
        verificationType: z.enum(['VERIFICATION_WITH_REGEX', 'VERIFICATION_UPON_CONFIRM_EMAIL', 'MANUAL_VERIFICATION'])
      })}
      onSubmit={(data) => {
        if (data.verificationRegex) {
          onSubmit({
            admin: {
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              password: data.password
            },
            setupConfig: {
              verificationInfo: {
                kind: data.verificationType,
                regex: data.verificationRegex
              }
            }
          });
        } else if (
          data.verificationType === 'MANUAL_VERIFICATION' ||
          data.verificationType === 'VERIFICATION_UPON_CONFIRM_EMAIL'
        ) {
          onSubmit({
            admin: {
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              password: data.password
            },
            setupConfig: {
              verificationInfo: {
                kind: data.verificationType
              }
            }
          });
        }
      }}
    />
  );
};

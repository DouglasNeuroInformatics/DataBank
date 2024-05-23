/* eslint-disable perfectionist/sort-objects */

import React from 'react';

import { Form } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import type { SetupDto } from '../../../../../packages/schemas/src/setup/setup';

type SetupFormProps = {
  onSubmit: (data: SetupDto) => void;
};

export const SetupForm = ({ onSubmit }: SetupFormProps) => {
  const { t } = useTranslation();
  return (
    <Form
      content={[
        {
          description: t('setup.admin.description'),
          fields: {
            email: {
              kind: 'string',
              label: t('email'),
              variant: 'input'
            },
            firstName: {
              kind: 'string',
              label: t('firstName'),
              variant: 'input'
            },
            lastName: {
              kind: 'string',
              label: t('lastName'),
              variant: 'input'
            },
            password: {
              kind: 'string',
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
              kind: 'string',
              variant: 'select',
              label: 'Verification Method',
              options: {
                MANUAL: 'Manually verify users by the admin',
                CONFIRM_EMAIL: 'Automatically verify users when they confirm their emails',
                REGEX_EMAIL: 'Verify users by matching their emails with a predefined regex'
              }
            },
            verificationRegex: {
              deps: ['verificationType'],
              kind: 'dynamic',
              render: (data) => {
                if (data?.verificationType === 'REGEX_EMAIL') {
                  return {
                    kind: 'string',
                    label: 'Regular expression',
                    variant: 'input'
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
        password: z.string().min(1),
        role: z.literal('Admin'),
        verificationRegex: z.string().optional(),
        verificationType: z.enum(['REGEX_EMAIL', 'CONFIRM_EMAIL', 'MANUAL'])
      })}
      onSubmit={(data) => {
        if (data.verificationRegex) {
          onSubmit({
            admin: {
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              password: data.password,
              role: 'ADMIN'
            },
            setupConfig: {
              userVerification: {
                method: data.verificationType,
                regex: data.verificationRegex
              }
            }
          });
        } else if (data.verificationType === 'MANUAL' || data.verificationType === 'CONFIRM_EMAIL') {
          onSubmit({
            admin: {
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              password: data.password,
              role: 'ADMIN'
            },
            setupConfig: {
              userVerification: {
                method: data.verificationType
              }
            }
          });
        }
      }}
    />
  );
};

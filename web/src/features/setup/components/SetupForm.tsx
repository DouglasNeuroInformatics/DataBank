/* eslint-disable perfectionist/sort-objects */

import { $SetupOptions } from '@databank/core';
import { Form } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { z } from 'zod';

type SetupFormProps = {
  onSubmit: (data: $SetupOptions) => void;
};

export const SetupForm = ({ onSubmit }: SetupFormProps) => {
  const { t } = useTranslation('common');
  return (
    <Form
      content={[
        {
          description: t('setupAdminDescription'),
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
          title: t('setupAdminTitle')
        },
        {
          description: t('verificationSectionDescription'),
          fields: {
            verificationType: {
              kind: 'string',
              variant: 'select',
              label: t('verificationMethods'),
              options: {
                MANUAL: t('manualVerification'),
                CONFIRM_EMAIL: t('verifyWhenConfirmEmail'),
                REGEX_EMAIL: t('verifyWithEmailRegex')
              }
            },
            verificationRegex: {
              deps: ['verificationType'],
              kind: 'dynamic',
              render: (data) => {
                if (data?.verificationType === 'REGEX_EMAIL') {
                  return {
                    kind: 'string',
                    label: t('regularExpression'),
                    variant: 'input'
                  };
                }
                return null;
              }
            }
          },
          title: t('verificationSectionTitle')
        }
      ]}
      submitBtnLabel={t('submit')}
      validationSchema={z.object({
        email: z.string().min(1).email(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        password: z.string().min(1),
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
              password: data.password
            },
            setupConfig: {
              verificationStrategy: {
                kind: 'REGEX_EMAIL',
                emailRegex: data.verificationRegex
              }
            }
          });
        } else if (data.verificationType === 'MANUAL' || data.verificationType === 'CONFIRM_EMAIL') {
          onSubmit({
            admin: {
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              password: data.password
            },
            setupConfig: {
              verificationStrategy: {
                kind: data.verificationType
              }
            }
          });
        }
      }}
    />
  );
};

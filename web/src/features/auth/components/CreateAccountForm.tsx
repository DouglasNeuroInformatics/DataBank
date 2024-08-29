import React from 'react';

import { Form } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export type CreateAccountData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type CreateAccountFormProps = {
  onSubmit: (data: CreateAccountData) => void;
};

const $CreateAccount = z.object({
  email: z.string().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(1)
});

// type CreateAccount = z.infer<typeof $CreateAccount>;

export const CreateAccountForm = ({ onSubmit }: CreateAccountFormProps) => {
  const { t } = useTranslation('common');
  return (
    <Form
      content={{
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
      }}
      validationSchema={$CreateAccount}
      onSubmit={onSubmit}
    />
  );
};

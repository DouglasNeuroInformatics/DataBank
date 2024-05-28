import React from 'react';

import type { LoginCredentials } from '@databank/types';
import { Form } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export type LoginFormProps = {
  onSubmit: (credentials: LoginCredentials) => void;
};

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const { t } = useTranslation();

  return (
    <Form
      content={{
        email: { kind: 'string', label: t('email'), variant: 'input' },
        password: { kind: 'string', label: t('password'), variant: 'password' }
      }}
      submitBtnLabel={t('login')}
      validationSchema={z.object({
        email: z.string().min(1),
        password: z.string().min(1)
      })}
      onSubmit={onSubmit}
    />
  );
};

import type { LoginCredentials } from '@databank/core';
import { Form } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { z } from 'zod';

type LoginFormProps = {
  onSubmit: (credentials: LoginCredentials) => void;
};

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const { t } = useTranslation('common');

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

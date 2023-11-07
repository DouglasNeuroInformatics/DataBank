import type { LoginCredentials } from '@databank/types';
import { Form } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

export type LoginFormProps = {
  onSubmit: (credentials: LoginCredentials) => void;
};

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const { t } = useTranslation();

  return (
    <Form<LoginCredentials>
      content={{
        email: { kind: 'text', label: t('email'), variant: 'short' },
        password: { kind: 'text', label: t('password'), variant: 'password' }
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

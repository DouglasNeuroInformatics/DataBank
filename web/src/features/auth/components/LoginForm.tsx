import { LoginCredentials } from '@databank/types';
import { Form } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';

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
      validationSchema={{
        errorMessage: {
          properties: {
            email: t('requiredField'),
            password: t('requiredField')
          }
        },
        properties: {
          email: {
            minLength: 1,
            type: 'string'
          },
          password: {
            minLength: 1,
            type: 'string'
          }
        },
        required: ['email', 'password'],
        type: 'object'
      }}
      onSubmit={onSubmit}
    />
  );
};

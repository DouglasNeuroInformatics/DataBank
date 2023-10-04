import { Form } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';

export type CreateAccountData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export type CreateAccountFormProps = {
  onSubmit: (data: CreateAccountData) => void;
};

export const CreateAccountForm = ({ onSubmit }: CreateAccountFormProps) => {
  const { t } = useTranslation();
  return (
    <Form<CreateAccountData>
      content={{
        email: { kind: 'text', label: t('email'), variant: 'short' },
        firstName: { kind: 'text', label: t('firstName'), variant: 'short' },
        lastName: { kind: 'text', label: t('lastName'), variant: 'short' },
        password: { kind: 'text', label: t('password'), variant: 'password' }
      }}
      errorMessages={{
        email: t('validEmail'),
        firstName: t('requiredField'),
        lastName: t('requiredField'),
        password: t('requiredField')
      }}
      submitBtnLabel={t('submit')}
      validationSchema={{
        properties: {
          email: {
            pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.source,
            type: 'string'
          },
          firstName: {
            minLength: 1,
            type: 'string'
          },
          lastName: {
            minLength: 1,
            type: 'string'
          },
          password: {
            minLength: 1,
            type: 'string'
          }
        },
        required: ['firstName', 'lastName', 'email', 'password'],
        type: 'object'
      }}
      onSubmit={onSubmit}
    />
  );
};

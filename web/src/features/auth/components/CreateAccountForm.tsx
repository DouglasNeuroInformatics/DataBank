import { Form } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';

export type CreateAccountData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export interface CreateAccountFormProps {
  onSubmit: (data: CreateAccountData) => void;
}

export const CreateAccountForm = ({ onSubmit }: CreateAccountFormProps) => {
  const { t } = useTranslation();
  return (
    <Form<CreateAccountData>
      content={{
        firstName: { kind: 'text', label: t('firstName'), variant: 'short' },
        lastName: { kind: 'text', label: t('lastName'), variant: 'short' },
        email: { kind: 'text', label: t('email'), variant: 'short' },
        password: { kind: 'text', label: t('password'), variant: 'password' },
      }}
      submitBtnLabel={t('submit')}
      validationSchema={{
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            minLength: 1
          },
          lastName: {
            type: 'string',
            minLength: 1
          },
          email: {
            type: 'string',
            pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.source
          },
          password: {
            type: 'string',
            minLength: 1
          }
        },
        required: ['firstName', 'lastName', 'email', 'password'],
        errorMessage: {
          properties: {
            firstName: t('requiredField'),
            lastName: t('requiredField'),
            email: t('validEmail'),
            password: t('requiredField')
          }
        }
      }}
      onSubmit={onSubmit}
    />
  );
};

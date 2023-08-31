import { SetupOptions } from '@databank/types';
import { Form } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';

type SetupData = SetupOptions['admin'];

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
          title: t('setup.admin.title'),
          description: t('setup.admin.description'),
          fields: {
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
            email: {
              kind: 'text',
              label: t('email'),
              variant: 'short'
            },
            password: {
              kind: 'text',
              label: t('password'),
              variant: 'password'
            }
          }
        }
      ]}
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
            minLength: 1,
            format: 'email'
          },
          password: {
            type: 'string',
            pattern: isStrongPassword.source
          }
        },
        required: ['firstName', 'lastName', 'email', 'password']
      }}
      onSubmit={(data) => {
        onSubmit({ admin: data });
      }}
    />
  );
};


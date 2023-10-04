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
          description: t('setup.admin.description'),
          fields: {
            email: {
              kind: 'text',
              label: t('email'),
              variant: 'short'
            },
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
            password: {
              kind: 'text',
              label: t('password'),
              variant: 'password'
            }
          },
          title: t('setup.admin.title')
        }
      ]}
      submitBtnLabel={t('submit')}
      validationSchema={{
        properties: {
          email: {
            format: 'email',
            minLength: 1,
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
            pattern: isStrongPassword.source,
            type: 'string'
          }
        },
        required: ['firstName', 'lastName', 'email', 'password'],
        type: 'object'
      }}
      onSubmit={(data) => {
        onSubmit({ admin: data });
      }}
    />
  );
};


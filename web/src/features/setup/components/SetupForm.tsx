import type { SetupOptions } from '@databank/types';
import { Form } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';
import { MergeDeep } from 'type-fest';

type SetupData = MergeDeep<SetupOptions['admin'], {
  verificationType: SetupOptions['setupConfig']['verificationInfo']['kind'], verificationRegex?: string
}>;

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
            type: 'string',
            pattern: isStrongPassword.source
          },
          verificationType: {
            type: 'string'
          },
          verificationRegex: {
            type: 'string',
            nullable: true
          }
        },
        required: ['firstName', 'lastName', 'email', 'password', 'verificationType']
      }}
      onSubmit={(data) => {
        if (data.verificationRegex){
          onSubmit({
            admin: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              password: data.password
            },
            setupConfig: {
              verificationInfo: {
                kind: data.verificationType,
                regex: new RegExp(data.verificationRegex)
              }
            }
          });
        } else if (data.verificationType === 'MANUAL_VERIFICATION' || data.verificationType === 'VERIFICATION_UPON_CONFIRM_EMAIL') {
          onSubmit({
            admin: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              password: data.password
            },
            setupConfig: {
              verificationInfo: {
                kind: data.verificationType,
              }
            }
          });
        }
        
      }}
    />
  );
};


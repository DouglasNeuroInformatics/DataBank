import { Form } from '@douglasneuroinformatics/react-components';
import { useTranslation } from 'react-i18next';

export type VerifyAccountData = {
  verificationCode: string;
};

export interface VerifyAccountFormProps {
  onSubmit: (data: VerifyAccountData) => void;
}

export const VerifyAccountForm = ({ onSubmit }: VerifyAccountFormProps) => {
  const { t } = useTranslation();
  return (
    <Form<VerifyAccountData>
      content={{
        verificationCode: { kind: 'text', label: t('verificationCode'), variant: 'short' }
      }}
      submitBtnLabel={t('submit')}
      validationSchema={{
        type: 'object',
        properties: {
          verificationCode: {
            type: 'string',
            minLength: 1
          }
        },
        required: ['verificationCode'],
        errorMessage: {
          properties: {
            verificationCode: t('requiredField')
          }
        }
      }}
      onSubmit={onSubmit}
    />
  );
};

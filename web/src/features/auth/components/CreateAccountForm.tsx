import { Form } from '@douglasneuroinformatics/ui';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

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
      submitBtnLabel={t('submit')}
      validationSchema={z.object({
        email: z.string().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        password: z.string().min(1)
      })}
      onSubmit={onSubmit}
    />
  );
};

import { estimatePasswordStrength } from '@douglasneuroinformatics/libpasswd';
import { Form } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { z } from 'zod/v4';

type CreateAccountData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

type CreateAccountFormProps = {
  onSubmit: (data: CreateAccountData) => void;
};

const $CreateAccount = z.object({
  email: z.string().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z
    .string()
    .min(1)
    .refine((val) => estimatePasswordStrength(val).success, 'Insufficiant Password Strength')
});

export const CreateAccountForm = ({ onSubmit }: CreateAccountFormProps) => {
  const { t } = useTranslation('common');
  return (
    <Form
      content={{
        email: {
          kind: 'string',
          label: t('email'),
          variant: 'input'
        },
        firstName: {
          kind: 'string',
          label: t('firstName'),
          variant: 'input'
        },
        lastName: {
          kind: 'string',
          label: t('lastName'),
          variant: 'input'
        },
        password: {
          calculateStrength: (password) => {
            return estimatePasswordStrength(password).score;
          },
          kind: 'string',
          label: t('password'),
          variant: 'password'
        }
      }}
      validationSchema={$CreateAccount}
      onSubmit={onSubmit}
    />
  );
};

export type { CreateAccountData };

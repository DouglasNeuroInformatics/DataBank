import { useEffect } from 'react';

import { estimatePasswordStrength } from '@douglasneuroinformatics/libpasswd';
import { Form } from '@douglasneuroinformatics/libui/components';
import { useNotificationsStore, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { z } from 'zod/v4';

import { AuthLayout } from '@/components/AuthLayout';
import { useCreateAccountMutation } from '@/hooks/mutations/useCreateAccountMutation';
import { useAppStore } from '@/store';

const $CreateAccount = z.object({
  email: z.string().regex(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z
    .string()
    .min(1)
    .refine((val) => estimatePasswordStrength(val).success, 'Insufficient Password Strength')
});

const RouteComponent = () => {
  const accessToken = useAppStore((s) => s.auth.ctx.accessToken);
  const currentUser = useAppStore((s) => s.auth.ctx.currentUser);
  const logout = useAppStore((s) => s.auth.act.logout);
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const createAccountMutation = useCreateAccountMutation();

  useEffect(() => {
    if (accessToken && currentUser?.confirmedAt) {
      void navigate({ to: '/portal/dashboard' });
    } else if (accessToken) {
      void navigate({ to: '/auth/confirm-email-code' });
    }
  }, [accessToken]);

  const createAccount = (data: z.infer<typeof $CreateAccount>) => {
    createAccountMutation.mutate(data, {
      onSuccess() {
        addNotification({ message: t('pleaseSignIn'), type: 'success' });
        logout();
        void navigate({ to: '/auth/login' });
      }
    });
  };

  return (
    <AuthLayout maxWidth="md" title={t('createAccount')}>
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
        onSubmit={(data) => createAccount(data)}
      />
    </AuthLayout>
  );
};

export const Route = createFileRoute('/auth/create-account')({
  component: RouteComponent
});

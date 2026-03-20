import { useEffect } from 'react';

import { $LoginCredentials, DEMO_USERS } from '@databank/core';
import { Card, Dialog, Form, Table, Tooltip } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { InfoIcon, LogInIcon } from 'lucide-react';
import { z } from 'zod/v4';

import { AuthLayout } from '@/components/AuthLayout';
import { useLoginMutation } from '@/hooks/mutations/useLoginMutation';
import { setupStateQueryOptions, useSetupStateQuery } from '@/hooks/queries/useSetupStateQuery';
import { useAppStore } from '@/store';

const DemoBanner = ({ onLogin }: { onLogin: (credentials: $LoginCredentials) => void }) => {
  const { t } = useTranslation('common');
  return (
    <Dialog>
      <div className="flex w-full items-center justify-center bg-sky-700 leading-tight text-white">
        <div className="container py-1.5">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <div className="my-1 flex items-center gap-3">
              <InfoIcon className="hidden h-5 w-5 lg:block" />
              <p className="text-center text-sm font-medium lg:text-left">{t('demo.welcome')}</p>
            </div>
            <Dialog.Trigger asChild>
              <button
                className="my-1.5 w-full max-w-md rounded-md border border-sky-400 px-2.5 py-1.5 text-sm font-medium hover:bg-sky-600 hover:shadow-lg lg:w-auto"
                type="button"
              >
                {t('demo.tryDemo')}
              </button>
            </Dialog.Trigger>
          </div>
        </div>
      </div>
      <Dialog.Content
        className="max-w-150 w-[calc(100%-1rem)] px-2.5 sm:px-6"
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
      >
        <Dialog.Header className="w-full whitespace-break-spaces px-1">
          <Dialog.Title className="mb-2">{t('demo.info')}</Dialog.Title>
          <Dialog.Description className="text-pretty text-left text-xs sm:text-sm">
            {t('demo.summary')}
          </Dialog.Description>
        </Dialog.Header>
        <Card className="text-muted-foreground w-full overflow-hidden rounded-md text-xs tracking-tighter sm:tracking-tight">
          <Table className="overflow-x-scroll">
            <Table.Header>
              <Table.Row>
                <Table.Head className="text-foreground p-3 px-2.5 text-xs sm:px-3.5 sm:text-sm">
                  {t('firstName')}
                </Table.Head>
                <Table.Head className="text-foreground p-3 px-2.5 text-xs sm:px-3.5 sm:text-sm">
                  {t('lastName')}
                </Table.Head>
                <Table.Head className="text-foreground p-3 px-2.5 text-xs sm:px-3.5 sm:text-sm">
                  {t('demo.role')}
                </Table.Head>
                <Table.Head className="text-foreground p-3 px-2.5 text-xs sm:px-3.5 sm:text-sm"></Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {DEMO_USERS.map((user) => (
                <Table.Row key={user.email}>
                  <Table.Cell className="p-3 px-2.5 text-xs sm:px-3.5 sm:text-sm">{user.firstName}</Table.Cell>
                  <Table.Cell className="p-3 px-2.5 text-xs sm:px-3.5 sm:text-sm">{user.lastName}</Table.Cell>
                  <Table.Cell className="p-3 px-2.5 text-xs sm:px-3.5 sm:text-sm">
                    {user.email === DEMO_USERS[0]!.email
                      ? 'Dataset Manager'
                      : user.verifiedAt
                        ? 'Verified User'
                        : 'Login User'}
                  </Table.Cell>
                  <Table.Cell className="p-3 px-2.5 sm:px-3.5">
                    <Tooltip delayDuration={500}>
                      <Tooltip.Trigger
                        className="h-9 w-9"
                        size="icon"
                        type="button"
                        variant="ghost"
                        onClick={() => onLogin({ email: user.email, password: user.password })}
                      >
                        <LogInIcon />
                      </Tooltip.Trigger>
                      <Tooltip.Content side="bottom">
                        <p>{t('demo.useCredentials')}</p>
                      </Tooltip.Content>
                    </Tooltip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </Dialog.Content>
    </Dialog>
  );
};

const RouteComponent = () => {
  const login = useAppStore((s) => s.auth.act.login);
  const accessToken = useAppStore((s) => s.auth.ctx.accessToken);
  const currentUser = useAppStore((s) => s.auth.ctx.currentUser);
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { data: setupState } = useSetupStateQuery();
  const loginMutation = useLoginMutation();

  useEffect(() => {
    if (accessToken && currentUser?.confirmedAt) {
      void navigate({ to: '/portal/dashboard' });
    } else if (accessToken) {
      void navigate({ to: '/auth/confirm-email-code' });
    }
  }, [accessToken]);

  const handleLogin = (credentials: $LoginCredentials) => {
    loginMutation.mutate(credentials, {
      onSuccess(response) {
        login(response.data.accessToken);
      }
    });
  };

  useEffect(() => {
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') {
      handleLogin({
        email: import.meta.env.VITE_DEV_EMAIL!,
        password: import.meta.env.VITE_DEV_PASSWORD!
      });
    }
  }, []);

  return (
    <>
      {setupState.isDemo && <DemoBanner onLogin={(credentials) => handleLogin(credentials)} />}
      <AuthLayout maxWidth="sm" title={t('login')}>
        <Form
          content={{
            email: { kind: 'string', label: t('email'), variant: 'input' },
            password: { kind: 'string', label: t('password'), variant: 'password' }
          }}
          submitBtnLabel={t('login')}
          validationSchema={z.object({
            email: z.string().min(1),
            password: z.string().min(1)
          })}
          onSubmit={(data) => handleLogin(data)}
        />
      </AuthLayout>
    </>
  );
};

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(setupStateQueryOptions());
  }
});

/* eslint-disable perfectionist/sort-objects */
import { Card, Form, Heading, LanguageToggle, ThemeToggle } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod/v4';

import { Logo } from '@/components/Logo';
import { useCreateSetupMutation } from '@/hooks/mutations/useCreateSetupMutation';

const RouteComponent = () => {
  const navigate = Route.useNavigate();

  const { t } = useTranslation('common');

  const createSetupMutation = useCreateSetupMutation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-full grow px-4 sm:m-8 sm:max-w-xl sm:grow-0 md:max-w-2xl">
        <Card.Header className="flex items-center justify-center">
          <Logo className="m-2 h-auto w-16" />
          <Heading variant="h2">{t({ en: 'Setup' })}</Heading>
        </Card.Header>
        <Card.Content>
          <Form
            content={[
              {
                fields: {
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
                  email: {
                    kind: 'string',
                    label: t('email'),
                    variant: 'input'
                  },
                  password: {
                    kind: 'string',
                    label: t('password'),
                    variant: 'password'
                  }
                },
                title: t({ en: 'Admin' })
              },
              {
                fields: {
                  isDemo: {
                    kind: 'boolean',
                    label: t('isDemoVersion'),
                    variant: 'radio'
                  },
                  verificationType: {
                    kind: 'string',
                    label: t('verificationMethods'),
                    options: {
                      CONFIRM_EMAIL: t('verifyWhenConfirmEmail'),
                      MANUAL: t('manualVerification'),
                      REGEX_EMAIL: t('verifyWithEmailRegex')
                    },
                    variant: 'select'
                  },
                  verificationRegex: {
                    deps: ['verificationType'],
                    kind: 'dynamic',
                    render: (data) => {
                      if (data?.verificationType === 'REGEX_EMAIL') {
                        return {
                          kind: 'string',
                          label: t('regularExpression'),
                          variant: 'input'
                        };
                      }
                      return null;
                    }
                  }
                },
                title: t({
                  en: 'App Settings'
                })
              }
            ]}
            submitBtnLabel={t('submit')}
            validationSchema={z.object({
              email: z.string().min(1).email(),
              firstName: z.string().min(1),
              isDemo: z.boolean(),
              lastName: z.string().min(1),
              password: z.string().min(1),
              verificationRegex: z.string().optional(),
              verificationType: z.enum(['REGEX_EMAIL', 'CONFIRM_EMAIL', 'MANUAL'])
            })}
            onSubmit={async (data) => {
              if (data.verificationRegex) {
                await createSetupMutation.mutateAsync({
                  admin: {
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    password: data.password
                  },
                  setupConfig: {
                    isDemo: data.isDemo,
                    verificationStrategy: {
                      emailRegex: data.verificationRegex,
                      kind: 'REGEX_EMAIL'
                    }
                  }
                });
              } else if (data.verificationType === 'MANUAL' || data.verificationType === 'CONFIRM_EMAIL') {
                await createSetupMutation.mutateAsync({
                  admin: {
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    password: data.password
                  },
                  setupConfig: {
                    isDemo: data.isDemo,
                    verificationStrategy: {
                      kind: data.verificationType
                    }
                  }
                });
              }
              await navigate({ to: '/' });
            }}
          />
        </Card.Content>
        <Card.Footer className="text-muted-foreground flex justify-between gap-3">
          <p className="text-sm">&copy; {new Date().getFullYear()} Douglas Neuroinformatics Platform</p>
          <div className="flex gap-2">
            <LanguageToggle
              align="start"
              options={{
                en: 'English',
                fr: 'Français'
              }}
              triggerClassName="border p-2"
              variant="ghost"
            />
            <ThemeToggle className="border p-2" variant="ghost" />
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/setup')({
  component: RouteComponent
});

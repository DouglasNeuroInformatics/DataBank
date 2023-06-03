'use client';

import { useRouter } from 'next/navigation';

import { Form } from '@douglasneuroinformatics/react-components';

import { Branding } from '@/components/Branding';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useClientTranslations } from '@/hooks/useClientTranslations';
import { useLocale } from '@/hooks/useLocale';
import { trpc } from '@/utils/trpc';

type LoginCredentials = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const t = useClientTranslations();
  const locale = useLocale();
  const router = useRouter();

  const login = trpc.auth.login.useMutation({
    onSuccess(data) {
      if (data) {
        router.push(`/${locale}/portal`);
      } else {
        // eslint-disable-next-line no-alert
        alert('ERROR');
      }
    }
  });

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-white px-6 py-8 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-800 md:p-8">
      <div className="mb-3 flex flex-col items-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        <Branding />
        <h3 className="mt-2">{t.login}</h3>
      </div>
      <Form<LoginCredentials>
        content={{
          email: { kind: 'text', label: t.email, variant: 'short' },
          password: { kind: 'text', label: t.password, variant: 'password' }
        }}
        validationSchema={{
          type: 'object',
          properties: {
            email: {
              type: 'string',
              minLength: 1
            },
            password: {
              type: 'string',
              minLength: 1
            }
          },
          required: ['email', 'password']
        }}
        onSubmit={(data) => void login.mutateAsync(data)}
      />
      <div className="flex w-full justify-between">
        <LanguageToggle dropdownDirection="up" />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default LoginPage;

'use client';

import React from 'react';

import { Form } from '@douglasneuroinformatics/react-components';

import { Branding } from '@/components/Branding';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useClientTranslations } from '@/hooks/useClientTranslations';

type LoginCredentials = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const t = useClientTranslations();

  const login = (data: LoginCredentials) => {
    // eslint-disable-next-line no-alert
    alert(JSON.stringify(data));
  };

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
        onSubmit={(data) => {
          void login(data);
        }}
      />
      <div className="flex w-full justify-between">
        <LanguageToggle dropdownDirection="up" />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default LoginPage;

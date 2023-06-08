'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Form, useNotificationsStore } from '@douglasneuroinformatics/react-components';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Branding } from '@/components/Branding';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useClientTranslations } from '@/hooks/useClientTranslations';

export type CreateUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const CreateAccountPage = () => {
  const t = useClientTranslations();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { addNotification } = useNotificationsStore();

  const createAccount = async ({ email, password }: CreateUserData) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`
      }
    });
    if (result.error) {
      addNotification({ type: 'error', message: `${result.error.status || 'Error'}: ${result.error.message}` });
    } else {
      addNotification({ type: 'success' });
      router.refresh();
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg bg-white px-6 py-8 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-800 md:p-8">
      <div className="mb-3 flex flex-col items-center text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
        <Branding />
        <h3 className="mt-2">{t.createAccount}</h3>
      </div>
      <Form<CreateUserData>
        content={{
          firstName: { kind: 'text', label: t.firstName, variant: 'short' },
          lastName: { kind: 'text', label: t.lastName, variant: 'short' },
          email: { kind: 'text', label: t.email, variant: 'short' },
          password: { kind: 'text', label: t.password, variant: 'password' }
        }}
        validationSchema={{
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              minLength: 1
            },
            lastName: {
              type: 'string',
              minLength: 1
            },
            email: {
              type: 'string',
              pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.source
            },
            password: {
              type: 'string',
              minLength: 1
            }
          },
          required: ['firstName', 'lastName', 'email', 'password']
        }}
        onSubmit={(data) => {
          void createAccount(data);
        }}
      />
      <div className="flex w-full justify-between">
        <LanguageToggle dropdownDirection="up" />
        <ThemeToggle />
      </div>
    </div>
  );
};

export default CreateAccountPage;

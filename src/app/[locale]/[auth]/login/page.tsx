import React from 'react';

import Image from 'next/image';

import { login } from './actions';

import { Form } from '@/components/Form';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { type Locale } from '@/lib/i18n';
import { getTranslations } from '@/utils/get-translations';

interface LoginPageProps {
  params: {
    locale: Locale;
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const t = await getTranslations(params.locale);
  return (
    <Form action={login}>
      <Form.Header>
        <Image alt="logo" className="mb-2" height={64} src="/logo.png" width={64} />
        <h3>{t.login}</h3>
      </Form.Header>
      <Form.TextField label={t.email} name="email" type="text" />
      <Form.TextField label={t.password} name="password" type="password" />
      <Form.SubmitButton label={t.login} />
      <Form.Footer className="flex w-full justify-between">
        <LanguageSwitcher dropdownDirection="up" />
        <ThemeToggle />
      </Form.Footer>
    </Form>
  );
}

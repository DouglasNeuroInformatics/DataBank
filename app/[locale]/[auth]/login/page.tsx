import React from 'react';

import { Form } from '@/components/Form';
import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/utils/get-translations';

import { login } from './actions';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';

interface LoginPageProps {
  params: {
    locale: Locale;
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const t = await getTranslations(params.locale);
  return (
    <Form action={login}>
      <Form.Heading>{t.login}</Form.Heading>
      <Form.TextField name="email" label={t.email} type="text" />
      <Form.TextField name="password" label={t.password} type="password" />
      <Form.SubmitButton label={t.login} />
      <Form.Footer className="flex w-full justify-between">
        <LanguageSwitcher dropdownDirection="up" />
        <ThemeToggle />
      </Form.Footer>
    </Form>
  );
}

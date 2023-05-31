import React from 'react';

import { createAccount } from './actions';

import { Branding } from '@/components/Branding';
import { Form } from '@/components/Form';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';
import { type Locale } from '@/lib/i18n';
import { getTranslations } from '@/utils/get-translations';

interface CreateAccountPageProps {
  params: {
    locale: Locale;
  };
}

export default async function CreateAccountPage({ params }: CreateAccountPageProps) {
  const t = await getTranslations(params.locale);
  return (
    <Form action={createAccount}>
      <Form.Header>
        <Branding />
        <h3 className="mt-2">{t.createAccount}</h3>
      </Form.Header>
      <Form.TextField label={t.firstName} name="firstName" type="text" />
      <Form.TextField label={t.lastName} name="lastName" type="text" />
      <Form.TextField label={t.email} name="email" type="text" />
      <Form.TextField label={t.password} name="password" type="password" />
      <Form.SubmitButton label={t.submit} />
      <Form.Footer className="flex w-full justify-between">
        <LanguageSwitcher dropdownDirection="up" />
        <ThemeToggle />
      </Form.Footer>
    </Form>
  );
}

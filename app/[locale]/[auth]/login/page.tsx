import React from 'react';

import { Form } from '@/components/Form';
import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/utils/get-translations';

import { login } from './actions';

interface LoginPageProps {
  params: {
    locale: Locale;
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const t = await getTranslations(params.locale);
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Form action={login}>
        <Form.TextField name="email" label={t.email} type="text" />
        <Form.TextField name="password" label={t.password} type="password" />
        <Form.SubmitButton label={t.login} />
      </Form>
    </div>
  );
}

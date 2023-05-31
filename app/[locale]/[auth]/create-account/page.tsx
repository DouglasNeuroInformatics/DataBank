import React from 'react';

import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/utils/get-translations';

import { handleCreateAccount } from './actions';
import { Form } from '@/components/Form';

interface CreateAccountPageProps {
  params: {
    locale: Locale;
  };
}

export default async function CreateAccountPage({ params }: CreateAccountPageProps) {
  const t = await getTranslations(params.locale);
  return (
    <Form action={handleCreateAccount}>
      <Form.TextField name="firstName" label="First Name" type="text" />
      <Form.TextField name="lastName" label="Last Name" type="text" />
      <Form.TextField name="email" label="Email" type="text" />
      <Form.TextField name="password" label="Password" type="password" />
      <Form.SubmitButton label="Submit" />
    </Form>
  );
}

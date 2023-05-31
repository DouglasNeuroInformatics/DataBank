import React from 'react';

import { handleCreateAccount } from './actions';

import { Form } from '@/components/Form';
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
    <Form action={handleCreateAccount}>
      <Form.TextField label="First Name" name="firstName" type="text" />
      <Form.TextField label="Last Name" name="lastName" type="text" />
      <Form.TextField label="Email" name="email" type="text" />
      <Form.TextField label="Password" name="password" type="password" />
      <Form.SubmitButton label="Submit" />
    </Form>
  );
}

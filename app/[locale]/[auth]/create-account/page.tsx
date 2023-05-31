import React from 'react';

import { Locale } from '@/lib/i18n';
import { getTranslations } from '@/utils/get-translations';

import { handleCreateAccount } from './actions';

interface CreateAccountPageProps {
  params: {
    locale: Locale;
  };
}

export default async function CreateAccountPage({ params }: CreateAccountPageProps) {
  const t = await getTranslations(params.locale);
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <form action={handleCreateAccount} className="flex max-w-md flex-col gap-3 border p-5">
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input className="appearance-none rounded-md border px-3 py-2 shadow" name="username" type="text" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input className="appearance-none rounded-md border px-3 py-2 shadow" name="email" type="text" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">{t.password}</label>
          <input className="appearance-none rounded-md border px-3 py-2 shadow" name="password" type="password" />
        </div>
        <button className="border" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

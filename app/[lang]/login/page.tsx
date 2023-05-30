import React from 'react';

import Image from 'next/image';

import logo from '@/assets/logo.png';
import { LoginForm } from '@/components/LoginForm';
import { useServerTranslations } from '@/hooks/useServerTranslations';
import { Locale } from '@/lib/i18n';
import { LoginFooter } from '@/components/LoginFooter';

interface LoginPageProps {
  params: {
    lang: Locale;
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const t = await useServerTranslations(params.lang);
  return (
    <div className="flex h-screen items-center justify-center bg-slate-100">
      <div className="flex flex-col items-center rounded-lg bg-slate-50 px-12 py-8 sm:w-[24rem]">
        <Image alt="logo" className="m-1 w-16" src={logo} />
        <h1 className="text-2xl font-bold">{t.login}</h1>
        <div className="mt-3 w-full">
          <LoginForm />
          <LoginFooter />
        </div>
      </div>
    </div>
  );
}

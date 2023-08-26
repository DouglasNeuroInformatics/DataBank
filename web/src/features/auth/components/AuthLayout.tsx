import React from 'react';

import { ThemeToggle } from '@douglasneuroinformatics/ui';

import { LanguageToggle, Logo } from '@/components';

export interface AuthLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex w-[22rem] flex-col items-center rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-800">
        <Logo className="m-1 h-auto w-16" />
        <h1 className="text-2xl font-bold tracking-tight first-letter:capitalize">{title}</h1>
        {children}
        <div className="mt-3 flex w-full justify-between bg-inherit">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

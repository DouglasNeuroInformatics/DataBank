import { LanguageToggle, ThemeToggle } from '@douglasneuroinformatics/libui/components';
import { Link } from 'react-router-dom';

import { Logo } from '@/components';

export type AuthLayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AuthLayout = ({ children, title }: AuthLayoutProps) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex w-[22rem] flex-col items-center rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-800">
        <Link className="flex items-center justify-center" to="/">
          <Logo className="m-1 h-auto w-16" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight first-letter:capitalize">{title}</h1>
        {children}
        <div className="mt-3 flex w-full justify-between bg-inherit">
          <LanguageToggle options={{ en: 'English', fr: 'French' }} />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

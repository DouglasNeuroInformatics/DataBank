import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LoginForm } from '../components/LoginForm';

import logo from '@/assets/logo.png';
import { LanguageToggle, ThemeToggle } from '@/components';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex w-[22rem] flex-col items-center rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-800">
        <img alt="logo" className="m-1 w-16" src={logo} />
        <h1 className="text-2xl font-bold tracking-tight first-letter:capitalize">{t('login')}</h1>
        <LoginForm onSuccess={() => navigate('/overview')} />
        <div className="mt-3 flex w-full justify-between bg-inherit">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

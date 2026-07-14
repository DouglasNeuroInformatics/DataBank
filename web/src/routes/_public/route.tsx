import { useEffect, useMemo, useState } from 'react';

import { LanguageToggle, Separator, Sheet, ThemeToggle } from '@douglasneuroinformatics/libui/components';
import { useMediaQuery, useTranslation } from '@douglasneuroinformatics/libui/hooks';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { MenuIcon } from 'lucide-react';

import { Logo } from '@/components/Logo';

const Header = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { t } = useTranslation();

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    if (isDesktop) {
      setIsSheetOpen(false);
    }
  }, [isDesktop]);

  const navLinks = useMemo<{ label: string; to: string }[]>(() => {
    return [
      {
        label: t('common.login'),
        to: '/auth/login'
      },
      {
        label: t('common.createAccount'),
        to: '/auth/create-account'
      },
      {
        label: t('common.viewPublicDatasets'),
        to: '/datasets'
      }
    ];
  }, [t]);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <header className="bg-card/80 fixed top-0 z-10 w-full border-b backdrop-blur-lg">
        <div className="container flex items-center justify-between py-3">
          <Link className="flex h-10 items-center no-underline [&>svg]:h-full [&>svg]:w-auto" to="/">
            <Logo />
            <span className="ml-3 whitespace-nowrap font-semibold tracking-tight">{t('common.platformName')}</span>
          </Link>
          <div className="hidden items-center gap-6 lg:flex">
            <nav className="flex items-center gap-4">
              {navLinks.map(({ label, to }) => (
                <Link
                  className="text-muted-foreground hover:text-foreground p-2 text-[0.9375rem] font-medium"
                  key={to}
                  to={to}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Separator className="h-6" orientation="vertical" />
            <div className="flex items-center gap-2">
              <ThemeToggle className="[&>svg]:h-5! [&>svg]:w-auto!" variant="ghost" />
              <LanguageToggle
                options={{ en: 'English', fr: 'Français' }}
                triggerClassName="[&>svg]:h-5! [&>svg]:w-auto!"
                variant="ghost"
              />
            </div>
          </div>
          <Sheet.Trigger className="lg:hidden">
            <MenuIcon className="text-muted-foreground hover:text-foreground h-7! w-auto!" />
          </Sheet.Trigger>
        </div>
      </header>
      <Sheet.Content className="flex h-full flex-col gap-0">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-auto" />
          <span className="whitespace-nowrap font-semibold tracking-tight">{t('common.platformName')}</span>
        </div>
        <Separator className="mb-3 mt-6" />
        <nav className="flex flex-col">
          {navLinks.map(({ label, to }) => (
            <Link
              className="text-muted-foreground hover:text-foreground p-2 text-[0.9375rem] font-medium"
              key={to}
              to={to}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex justify-end gap-2">
          <LanguageToggle
            options={{
              en: 'English',
              fr: 'Français'
            }}
            triggerClassName="[&>svg]:h-5! [&>svg]:w-auto!"
            variant="outline"
          />
          <ThemeToggle className="[&>svg]:h-5![&>svg]:w-auto!" variant="outline" />
        </div>
      </Sheet.Content>
    </Sheet>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-card mt-auto border-t py-4 text-sm">
      <div className="text-muted-foreground container flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <a
          className="hover:text-foreground"
          href="https://douglasneuroinformatics.ca/"
          rel="noreferrer"
          target="_blank"
        >
          {t({ en: 'Douglas Neuroinformatics', fr: 'Douglas Neuroinformatics' })}
        </a>
        <span>&#183;</span>
        <a
          className="hover:text-foreground"
          href="https://github.com/DouglasNeuroInformatics/OpenDataCapture"
          rel="noreferrer"
          target="_blank"
        >
          {t({ en: 'GitHub', fr: 'GitHub' })}
        </a>
        <span>&#183;</span>
        <a
          className="hover:text-foreground"
          href="https://github.com/DouglasNeuroInformatics/OpenDataCapture"
          rel="noreferrer"
          target="_blank"
        >
          {t({ en: 'Open Data Capture', fr: 'Capture de données ouvertes' })}
        </a>
      </div>
      <p className="text-muted-foreground mt-1.5 text-center">
        &copy; {new Date().getFullYear()} {t({ en: 'Douglas Neuroinformatics Platform' })}
      </p>
    </footer>
  );
};

const RouteComponent = () => {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="container mb-16 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const Route = createFileRoute('/_public')({
  component: RouteComponent
});

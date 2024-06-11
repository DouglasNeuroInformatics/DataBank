import React from 'react';

import { Card, Heading, LanguageToggle, ThemeToggle } from '@douglasneuroinformatics/libui/components';
import { useTranslation } from 'react-i18next';

import { Logo } from '@/components/Logo';

import { SetupForm } from '../components/SetupForm';

import type { SetupDto } from '../../../../../packages/schemas/src/setup/setup';

export type SetupPageProps = {
  onSubmit: (data: SetupDto) => void;
};
//
export const SetupPage = ({ onSubmit }: SetupPageProps) => {
  const { t } = useTranslation('common');
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-full grow px-4 sm:m-8 sm:max-w-xl sm:grow-0 md:max-w-2xl">
        <Card.Header className="flex items-center justify-center">
          <Logo className="m-2 h-auto w-16" />
          <Heading variant="h2">{t('setupPageTitle')}</Heading>
        </Card.Header>
        <Card.Content>
          <SetupForm onSubmit={onSubmit} />
        </Card.Content>
        <Card.Footer className="text-muted-foreground flex justify-between gap-3">
          <p className="text-sm">&copy; {new Date().getFullYear()} Douglas Neuroinformatics Platform</p>
          <div className="flex gap-2">
            <LanguageToggle
              align="start"
              options={{
                en: 'English',
                fr: 'Français'
              }}
              triggerClassName="border p-2"
              variant="ghost"
            />
            <ThemeToggle className="border p-2" variant="ghost" />
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
};

import React from 'react';

import { HomeIcon } from '@heroicons/react/24/solid';

import { Sidebar } from '@/components/Sidebar';
import { useServerTranslations } from '@/hooks/useServerTranslations';
import { type Locale } from '@/lib/i18n';

export const metadata = {
  title: 'Data Bank',
  description: 'Minimum Viable Product'
};

export default async function Root({ children, params }: { children: React.ReactNode; params: { locale: Locale } }) {
  const t = await useServerTranslations(params.locale);
  return (
    <div className="flex">
      <Sidebar
        links={[
          {
            href: '/',
            icon: <HomeIcon />,
            label: 'Home'
          }
        ]}
        title={t['meta.platformName']}
      />
      <main>{children}</main>
    </div>
  );
}

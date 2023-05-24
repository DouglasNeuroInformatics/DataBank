import React from 'react';

import { HomeIcon } from '@heroicons/react/24/solid';

import { Sidebar } from '@/components/Sidebar';
import { useServerTranslations } from '@/hooks/useServerTranslations';
import { type Locale } from '@/i18n-config';

export const metadata = {
  title: 'Data Bank',
  description: 'Minimum Viable Product'
};

export default async function Root({ children, params }: { children: React.ReactNode; params: { lang: Locale } }) {
  const t = await useServerTranslations(params.lang);
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

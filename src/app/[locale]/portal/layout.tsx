import React from 'react';

import { ChartBarIcon } from '@heroicons/react/24/solid';

import { Sidebar } from '@/components/Sidebar';
import { type Locale } from '@/lib/i18n';
import { getTranslations } from '@/utils/get-translations';

interface PortalLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

const PortalLayout = async ({ children, params }: PortalLayoutProps) => {
  const t = await getTranslations(params.locale);
  return (
    <div className="flex">
      <Sidebar
        links={[
          {
            label: 'Overview',
            href: '/portal',
            icon: <ChartBarIcon />
          }
        ]}
        title={t.meta.platformName}
      />
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default PortalLayout;

import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ChartBarIcon } from '@heroicons/react/24/solid';

import { Sidebar } from '@/components/Sidebar';
import { type Locale } from '@/lib/i18n';
import { ACCESS_TOKEN_COOKIE_NAME } from '@/server/context';
import { getTranslations } from '@/utils/get-translations';

interface PortalLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

const PortalLayout = async ({ children, params }: PortalLayoutProps) => {
  const cookieStore = cookies();

  const t = await getTranslations(params.locale);

  const isLoggedIn = Boolean(cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value);

  if (!isLoggedIn) {
    redirect(`/${params.locale}/auth/login`);
  }
  
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

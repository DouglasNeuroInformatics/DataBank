import React from 'react';

import { Dashboard } from '@/components/Dashboard';
import { type Locale } from '@/i18n';
import { getTranslations } from '@/i18n/server';

interface PortalPageProps {
  params: {
    locale: Locale;
  };
}

const PortalPage = async ({ params }: PortalPageProps) => {
  const t = await getTranslations(params.locale);
  return (
    <div className="py-10">
      <header>
        <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
      </header>
      <main>
        <div className="py-8">
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default PortalPage;

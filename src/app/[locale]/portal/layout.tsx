import React from 'react';

import { Layout } from '@/components/Layout';
import { type Locale } from '@/i18n';

interface PortalLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

const PortalLayout = ({ children }: PortalLayoutProps) => {
  return (
    <Layout>
      <main className="container">{children}</main>
    </Layout>
  );
};

export default PortalLayout;

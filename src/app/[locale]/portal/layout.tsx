import React from 'react';

import { Navbar } from '@/components/Navbar';
import { type Locale } from '@/i18n';

interface PortalLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

const PortalLayout = ({ children }: PortalLayoutProps) => {
  return (
    <React.Fragment>
      <Navbar />
      <main className="container">{children}</main>
    </React.Fragment>
  );
};

export default PortalLayout;

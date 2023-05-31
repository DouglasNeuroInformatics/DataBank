import React from 'react';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="flex h-screen w-screen flex-col items-center justify-center">
    {children}
    <div>
      <LanguageSwitcher dropdownDirection="up" />
    </div>
  </div>
);

export default AuthLayout;

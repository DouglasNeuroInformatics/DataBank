'use client';

import React from 'react';

import { signIn } from 'next-auth/react';

import { Navbar } from './Navbar';

import { useClientTranslations } from '@/hooks/useClientTranslations';

export const LandingHeader = () => {
  const t = useClientTranslations();
  return (
    <Navbar
      items={[
        {
          kind: 'btn',
          label: t.login,
          onClick: () => void signIn()
        },
        {
          kind: 'btn',
          label: t.createAccount,
          onClick: () => null
        }
      ]}
    />
  );
};

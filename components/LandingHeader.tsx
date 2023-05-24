'use client';

import React from 'react';

import { signIn } from 'next-auth/react';

import { Branding } from './Branding';

import { useClientTranslations } from '@/hooks/useClientTranslations';

export const LandingHeader = () => {
  const t = useClientTranslations();
  return (
    <header className="flex">
      <Branding title={t['meta.platformName']} />
      <nav className="flex-grow flex justify-end items-center">
        <button className="font-medium p-2" onClick={() => void signIn()}>
          Login
        </button>
        <button className="font-medium p-2">Sign Up</button>
      </nav>
    </header>
  );
};

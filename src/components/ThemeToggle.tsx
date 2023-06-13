'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Cookies from 'js-cookie';

type Theme = 'light' | 'dark';

export interface ThemeToggleProps {
  className?: string;
}
export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const [theme, setTheme] = useState<Theme>();
  const router = useRouter();

  const getDefaultTheme = () => {
    const savedPreference = Cookies.get('theme');
    if (savedPreference === 'light' || savedPreference === 'dark') {
      return savedPreference;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  useEffect(() => {
    if (theme) {
      Cookies.set('theme', theme, {
        expires: 365,
        path: '/',
        sameSite: 'Lax'
      });
      router.refresh();
    } else {
      setTheme(getDefaultTheme());
    }
  }, [theme]);

  return (
    <button
      className={clsx('rounded-full p-2 transition-transform', className)}
      type="button"
      onClick={() => setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))}
    >
      {theme === 'dark' ? <SunIcon height={24} width={24} /> : <MoonIcon height={24} width={24} />}
    </button>
  );
};

'use client';

import React, { useState } from 'react';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>();

  const handleToggle = () => {
    const root = document.querySelector('html');
    if (root) {
      const theme = root.classList.toggle('dark') ? 'dark' : 'light';
      document.cookie = `theme=${theme}`;
      setTheme(theme);
    }
  };

  return (
    <button type="button" onClick={handleToggle}>
      {theme === 'dark' ? <SunIcon height={24} width={24} /> : <MoonIcon height={24} width={24} />}
    </button>
  );
};

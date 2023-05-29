'use client';

import React from 'react';

import { SunIcon } from '@heroicons/react/24/outline';

export const ThemeSwitcher = () => {
  return (
    <button
      type="button"
      onClick={() => {
        document.body.classList.toggle('dark');
      }}
    >
      <SunIcon height={24} width={24} />
    </button>
  );
};

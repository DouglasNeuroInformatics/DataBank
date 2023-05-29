'use client';

import React, { useEffect, useState } from 'react';

import { SunIcon } from '@heroicons/react/24/outline';

export const ThemeSwitcher = () => {
  const handleToggle = () => {
    const root = document.querySelector('html');
    if (root) {
      const theme = root.classList.toggle('dark') ? 'dark' : 'light';
      document.cookie = `theme=${theme}`;
    }
  };

  return (
    <button type="button" onClick={handleToggle}>
      <SunIcon height={24} width={24} />
    </button>
  );
};

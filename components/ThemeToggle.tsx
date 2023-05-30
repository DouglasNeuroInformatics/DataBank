import React from 'react';

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

export const ThemeToggle = () => {
  const handleToggle = () => {
    const root = document.querySelector('html');
    if (root) {
      const theme = root.classList.toggle('dark') ? 'dark' : 'light';
      document.cookie = `theme=${theme}`;
    }
  };

  return (
    <button type="button" onClick={handleToggle}>
      <MoonIcon height={24} width={24} />
      {/* {theme === 'dark' ? <SunIcon height={24} width={24} /> : <MoonIcon height={24} width={24} />} */}
    </button>
  );
};

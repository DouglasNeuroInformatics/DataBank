import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));

  return (
    <button
      className="rounded-md p-2 transition-transform hover:backdrop-brightness-95 dark:hover:backdrop-brightness-150"
      type="button"
      onClick={toggleTheme}
    >
      {theme === 'dark' ? <SunIcon height={24} width={24} /> : <MoonIcon height={24} width={24} />}
    </button>
  );
};

import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));

  return (
    <button className="rounded-full p-2 transition-transform" type="button" onClick={toggleTheme}>
      {theme === 'dark' ? <SunIcon height={24} width={24} /> : <MoonIcon height={24} width={24} />}
    </button>
  );
};

import { usePathname } from 'next/navigation';

import { Locale } from '@/lib/i18n';

export function useRedirectedPathname() {
  const pathname = usePathname();

  return (locale: Locale) => {
    if (!pathname) {
      return '/';
    }
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };
}

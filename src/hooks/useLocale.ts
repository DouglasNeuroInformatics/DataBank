import { usePathname } from 'next/navigation';

import { type Locale } from '@/lib/i18n';

export function useLocale() {
  const pathname = usePathname();
  return pathname.split('/')[1] as Locale;
}

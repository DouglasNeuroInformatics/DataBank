import 'client-only';

import { usePathname } from 'next/navigation';

import { type Locale } from '@/i18n';

export function useLocale() {
  const pathname = usePathname();
  return pathname.split('/')[1] as Locale;
}

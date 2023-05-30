import React from 'react';

import { Counter } from '@/components/Counter';
import { useServerTranslations } from '@/hooks/useServerTranslations';
import { Locale } from '@/lib/i18n';

export default async function IndexPage({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await useServerTranslations(locale);
  return (
    <div>
      <p>Current locale: {locale}</p>
      <p>This text is rendered on the server: {t['server-component'].welcome}</p>
      <Counter />
    </div>
  );
}

import React from 'react';

import { Counter } from '@/components/Counter';
import { useServerTranslations } from '@/hooks/useServerTranslations';
import { Locale } from '@/lib/i18n';

export default async function IndexPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = await useServerTranslations(lang);

  return (
    <div>
      <p>Current locale: {lang}</p>
      <p>This text is rendered on the server: {t['server-component'].welcome}</p>
      <Counter />
    </div>
  );
}

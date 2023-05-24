import React from 'react';

import { Counter } from '@/components/Counter';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { getTranslations } from '@/get-translations';
import { Locale } from '@/i18n-config';

export default async function IndexPage({ params: { lang } }: { params: { lang: Locale } }) {
  const t = await getTranslations(lang);

  return (
    <div>
      <LocaleSwitcher />
      <p>Current locale: {lang}</p>
      <p>This text is rendered on the server: {t['server-component'].welcome}</p>
      <Counter dictionary={t.counter} />
    </div>
  );
}

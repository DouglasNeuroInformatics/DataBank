import { Locale } from '../../i18n-config';

import Counter from './components/counter';
import LocaleSwitcher from './components/locale-switcher';

import { getTranslations } from '@/get-translations';

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

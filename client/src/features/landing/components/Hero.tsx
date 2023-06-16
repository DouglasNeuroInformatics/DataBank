import { Button } from '@douglasneuroinformatics/react-components';
import { useTranslation } from 'react-i18next';

import { HeroIcon } from './HeroIcon';

export const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="flex gap-5">
      <div className="flex-grow">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-300 md:text-4xl lg:text-5xl">
          {t('platformName')}
        </h1>
        <p className="mt-3 w-11/12 text-lg text-slate-600 sm:text-lg md:mt-5">{t('platformDescription')}</p>
        <div className="mt-5 flex gap-3">
          <Button label={t('getStarted')} />
          <Button label={t('learnMore')} variant="secondary" />
        </div>
      </div>
      <div className="hidden w-80 xl:block">
        <HeroIcon />
      </div>
    </section>
  );
};

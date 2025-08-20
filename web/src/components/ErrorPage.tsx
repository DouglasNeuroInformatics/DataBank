import { useEffect } from 'react';

import { useTranslation } from '@douglasneuroinformatics/libui/hooks';

type ErrorPageProps = {
  error: {
    message: string;
  };
};

export const ErrorPage = ({ error }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const { t } = useTranslation('common');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-1 p-3 text-center">
      <h1 className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">{t('unexpectedError')}</h1>
      <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">{t('somethingWentWrong')}</h3>
      <p className="text-muted-foreground mt-2 max-w-prose text-sm sm:text-base">{t('apologizeForInconvenience')}</p>
      <div className="mt-6">
        <button
          className="text-sky-800 underline-offset-4 hover:text-sky-700 hover:underline dark:text-sky-200 dark:hover:text-sky-300"
          type="button"
          onClick={() => {
            window.location.assign(window.location.origin);
          }}
        >
          {t('reloadPage')}
          <span aria-hidden="true"> &rarr;</span>
        </button>
      </div>
    </div>
  );
};

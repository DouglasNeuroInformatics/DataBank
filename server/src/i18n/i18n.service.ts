import { Injectable } from '@nestjs/common';

import { Locale } from '@databank/types';
import { Request } from 'express';
import { MergeDeep } from 'type-fest';

import en from './translations/en.json';
import fr from './translations/fr.json';

type Path<T extends object, K extends string = Extract<keyof T, string>> = K extends keyof T
  ? T[K] extends object
    ? `${K}.${Path<T[K]>}`
    : K
  : never;

type Translations = MergeDeep<typeof en, typeof fr>;

@Injectable()
export class I18nService {
  private readonly resources: Record<Locale, Translations> = { en, fr };

  translate(locale: Locale, path: Path<Translations>) {
    let item: any = this.resources[locale];
    path.split('.').forEach((key) => {
      item = (item as Record<string, string>)[key];
    });
    return item as string;
  }

  /** Extract the user's preferred locale from the `Accept-Language` header */
  extractLocale(req: Request): Locale {
    if (req.acceptsLanguages()[0].toLowerCase().startsWith('fr')) {
      return 'fr';
    }
    return 'en';
  }
}

import fs from 'node:fs';
import path from 'node:path';

import type { Locale } from '@databank/core';
import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { MergeDeep } from 'type-fest';

import type en from './translations/en.json';
import type fr from './translations/fr.json';

type Path<T extends object, K extends string = Extract<keyof T, string>> = K extends keyof T
  ? T[K] extends object
    ? `${K}.${Path<T[K]>}`
    : K
  : never;

type Translations = MergeDeep<typeof en, typeof fr>;

@Injectable()
export class I18nService {
  private readonly defaultLocale: Locale = 'en';
  private readonly resources: { [K in Locale]: Translations };

  constructor() {
    this.resources = {
      en: this.loadTranslations('en'),
      fr: this.loadTranslations('fr')
    };
  }

  /** Extract the user's preferred locale from the `Accept-Language` header */
  extractLocale(req: Request): Locale {
    if (req.acceptsLanguages()[0]?.toLowerCase().startsWith('fr')) {
      return 'fr';
    }
    return 'en';
  }

  loadTranslations(locale: Locale) {
    const filepath = path.resolve(import.meta.dirname, 'translations', `${locale}.json`);
    return JSON.parse(fs.readFileSync(filepath, 'utf-8')) as Translations;
  }

  translate(locale: Locale | undefined, path: Path<Translations>) {
    let item: unknown = this.resources[locale ?? this.defaultLocale];
    path.split('.').forEach((key) => {
      item = (item as { [key: string]: string })[key];
    });
    return item as string;
  }
}

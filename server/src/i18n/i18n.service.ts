import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { Injectable } from '@nestjs/common';

import { Locale } from '@databank/types';
import { Request } from 'express';
import { MergeDeep } from 'type-fest';

import type en from './translations/en.json';
import type fr from './translations/fr.json';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type Path<T extends object, K extends string = Extract<keyof T, string>> = K extends keyof T
  ? T[K] extends object
    ? `${K}.${Path<T[K]>}`
    : K
  : never;

type Translations = MergeDeep<typeof en, typeof fr>;

@Injectable()
export class I18nService {
  private readonly resources: Record<Locale, Translations>;

  constructor() {
    this.resources = {
      en: this.loadTranslations('en'),
      fr: this.loadTranslations('fr')
    };
  }

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

  loadTranslations(locale: Locale) {
    const filepath = path.resolve(__dirname, 'translations', `${locale}.json`);
    return JSON.parse(fs.readFileSync(filepath, 'utf-8')) as Translations;
  }
}

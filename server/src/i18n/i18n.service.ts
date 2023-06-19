import { Injectable } from '@nestjs/common';

import { Locale } from '@databank/types';
import { Request } from 'express';

@Injectable()
export class I18nService {
  /** Extract the user's preferred locale from the `Accept-Language` header */
  extractLocale(req: Request): Locale {
    if (req.acceptsLanguages()[0].toLowerCase().startsWith('fr')) {
      return 'fr';
    }
    return 'en';
  }
}

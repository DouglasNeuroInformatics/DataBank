import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import { I18nService } from '@/i18n/i18n.service';

@Injectable()
export class AcceptLanguageMiddleware implements NestMiddleware {
  constructor(private readonly i18nService: I18nService) {}

  use(req: Request, _: Response, next: NextFunction) {
    // @ts-expect-error - this is badly designed and will be deleted ASAP
    req.user = Object.assign(req.user ?? {}, {
      locale: this.i18nService.extractLocale(req)
    });
    next();
  }
}

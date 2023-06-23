import { Injectable, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

import { I18nService } from '@/i18n/i18n.service.js';

@Injectable()
export class AcceptLanguageMiddleware implements NestMiddleware {
  constructor(private readonly i18nService: I18nService) {}

  use(req: Request, res: Response, next: NextFunction) {
    req.user = Object.assign(req.user ?? {}, {
      locale: this.i18nService.extractLocale(req)
    });
    next();
  }
}

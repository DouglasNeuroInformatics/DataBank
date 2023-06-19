import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { ExceptionResponse, Locale } from '@databank/types';
import { Request, Response } from 'express';
import { P, match } from 'ts-pattern';

import { TranslationService } from '@/translation/translation.service.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly translationService: TranslationService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const locale = this.getLocale(req);
    console.log(locale);

    let statusCode: HttpStatus;
    let message: string;
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = match(exception.getResponse())
        .with(P.string, (res) => res)
        .with({ message: P.string }, (res) => res.message)
        .otherwise(() => 'An unexpected error occurred');
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
    }

    this.logger.log(`${req.method}`);

    res.status(statusCode).send({ message } satisfies ExceptionResponse);
  }

  private getLocale(req: Request): Locale {
    if (req.acceptsLanguages()[0].toLowerCase().startsWith('fr')) {
      return 'fr';
    }
    return 'en';
  }
}

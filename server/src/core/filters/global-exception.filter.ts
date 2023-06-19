import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { ExceptionResponse } from '@databank/types';
import { Request, Response } from 'express';
import { P, match } from 'ts-pattern';

import { TranslationService } from '@/translation/translation.service.js';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly translationService: TranslationService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

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

    this.logger.log(`${request.method}`);

    response.status(statusCode).send({ message } satisfies ExceptionResponse);
  }
}

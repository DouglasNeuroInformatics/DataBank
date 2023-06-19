import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

import { Request, Response } from 'express';

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
    let responseBody: string | object;
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      responseBody = exception.getResponse();
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = 'Internal Server Error';
    }

    this.logger.log(`${request.method}`);

    response.status(statusCode).send(responseBody);
  }
}

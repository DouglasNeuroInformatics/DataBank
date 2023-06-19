import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { Request } from 'express';

import { TranslationService } from '@/translation/translation.service.js';

@Catch()
export class GlobalExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly translationService: TranslationService) {
    super();
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const request = context.getRequest<Request>();
    this.logger.error(
      JSON.stringify({
        method: request.method,
        error: exception
      })
    );
    super.catch(exception, host);
  }
}

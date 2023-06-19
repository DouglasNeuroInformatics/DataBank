import { Module } from '@nestjs/common';

import { TranslationService } from './translation.service.js';

@Module({
  providers: [TranslationService],
  exports: [TranslationService]
})
export class TranslationModule {}

import { Module } from '@nestjs/common';

import { MailService } from './mail.service.js';

@Module({
  exports: [MailService],
  providers: [MailService]
})
export class MailModule {}

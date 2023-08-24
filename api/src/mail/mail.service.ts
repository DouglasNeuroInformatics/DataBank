import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { type SendMailOptions, type Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor(configService: ConfigService) {
    this.transporter = createTransport({
      host: configService.getOrThrow('SMTP_HOST'),
      port: configService.getOrThrow('SMTP_PORT'),
      secure: false,
      auth: {
        user: configService.getOrThrow('SMTP_USER'),
        pass: configService.getOrThrow('SMTP_PASS')
      }
    });
  }

  async sendMail(options: Omit<SendMailOptions, 'from'>): Promise<void> {
    await this.transporter.sendMail(
      Object.assign(options, {
        from: 'douglasneuroinformatics@zohomail.com'
      })
    );
  }
}

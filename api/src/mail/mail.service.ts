import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type SendMailOptions, type Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      auth: {
        pass: configService.getOrThrow('SMTP_PASS'),
        user: configService.getOrThrow('SMTP_USER')
      },
      host: configService.getOrThrow('SMTP_HOST'),
      port: configService.getOrThrow('SMTP_PORT'),
      secure: false
    });
  }

  async sendMail(options: Omit<SendMailOptions, 'from'>): Promise<void> {
    const user_email: string = this.configService.getOrThrow('SMTP_USER');
    await this.transporter.sendMail(
      Object.assign(options, {
        from: user_email
      })
    );
  }
}

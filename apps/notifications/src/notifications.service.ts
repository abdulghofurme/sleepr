import { NotifyEmailDto } from '@app/common/dto/notify-email.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get('SMTP_USER'),
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  });

  async notifyEmail({ email, text, html, subject }: NotifyEmailDto) {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_USER'),
        to: email,
        subject,
        text,
        html,
      });
    } catch (error) {
      this.logger.error('Failed to send email', error.stack);
      throw error;
    }
  }
}

import { NotifyEmailDto } from '@app/common/dto/notify-email.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  async notifyEmail({ email }: NotifyEmailDto) {
    console.log({ email });
  }
}

import {
  Controller,
  Get,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { NotifyEmailDto } from '@app/common/dto/notify-email.dto';
import { RmqRetryInteceptor } from './interceptors/rmq-retry.interceptor';
import { Logger } from 'nestjs-pino';

@Controller()
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly logger: Logger,
  ) {}

  @MessagePattern('notify_email')
  @UseInterceptors(RmqRetryInteceptor)
  @UsePipes(new ValidationPipe())
  async notifyEmail(
    @Payload() data: NotifyEmailDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const res = this.notificationsService.notifyEmail(data);
      channel.ack(originalMsg);
      return res;
    } catch (error) {
      this.logger.log('notify_email error: ', error);
      channel.nack(originalMsg, false, true); // requeue
    }
  }
}

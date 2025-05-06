import {
  Controller,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';
import { Logger } from 'nestjs-pino';
import { RmqRetryInteceptor } from './interceptors/rmq-retry.interceptor';

@Controller()
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly logger: Logger,
  ) {}

  @MessagePattern('create_charge')
  @UseInterceptors(RmqRetryInteceptor)
  @UsePipes(new ValidationPipe())
  async createCharge(
    @Payload() data: PaymentsCreateChargeDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const paymentIntent = await this.paymentsService.createCharge(data);
      channel.ack(originalMsg);

      return paymentIntent;
    } catch (error) {
      this.logger.log(`create_charge error: `, error);
      channel.nack(originalMsg, false, true); // requeue
    }
  }
}

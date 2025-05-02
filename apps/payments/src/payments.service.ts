import { CreateChargeDto, CurrentUserDto } from '@app/common';
import { NOTIFICATIONS_SERVICE } from '@app/common/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dtos';
import * as path from 'path';
import * as fs from 'fs';
import * as hbs from 'handlebars';
import { NotifyEmailDto } from '@app/common/dto/notify-email.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2025-04-30.basil',
    },
  );

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
  ) {}

  private compileTemplate(templateName: string, context: any): string {
    const filePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
    const source = fs.readFileSync(filePath, 'utf8');
    const template = hbs.compile(source);
    return template(context);
  }

  async createCharge({
    paymentMethodId,
    amount,
    email,
  }: PaymentsCreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method_types: ['card'],
      payment_method: paymentMethodId || 'pm_card_visa', // payemnt_method should be secure created from frontend
      // debug
      confirm: true, // auto confirm
    });

    this.notificationsService.emit<string, NotifyEmailDto>('notify_email', {
      email,
      subject: `Sleepr payment - ${paymentIntent.id}`,
      text: `You've charged $${amount} from ${paymentIntent.id}`,
    });

    return paymentIntent;
  }
}

import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2025-04-30.basil',
    },
  );

  constructor(private readonly configService: ConfigService) {}

  async createCharge({
    paymentMethodId,
    amount,
  }: CreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      payment_method_types: ['card'],
      payment_method: paymentMethodId || "pm_card_visa", // payemnt_method should be secure created from frontend
      // debug
      confirm: true, // auto confirm
    });

    return paymentIntent;
  }
}

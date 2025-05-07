import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateChargeMessage } from '../types';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateChargeDto implements Omit<CreateChargeMessage, 'email'> {
  @IsOptional()
  @IsString()
  @Field()
  paymentMethodId?: string;

  @IsNotEmpty()
  @IsNumber()
  @Field()
  amount: number;
}

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateChargeMessage } from '../types';

export class CreateChargeDto implements Omit<CreateChargeMessage, 'email'> {
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

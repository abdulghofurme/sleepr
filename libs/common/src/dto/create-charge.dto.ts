import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChargeDto {
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

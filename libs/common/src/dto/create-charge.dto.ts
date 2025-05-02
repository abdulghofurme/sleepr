// import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  // IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  // ValidateNested,
} from 'class-validator';
// import { CardDto } from './card.dto';

export class CreateChargeDto {
  // @IsNotEmptyObject()
  // @ValidateNested()
  // @Type(() => CardDto)
  // card: CardDto;
  // @IsNotEmpty()
  @IsOptional()
  @IsString()
  paymentMethodId: string

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

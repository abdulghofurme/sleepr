import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateChargeDto } from '@app/common';

export class CreateReservationDto {
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const [day, month, year] = value.split('-').map(Number);
      return new Date(year, month - 1, day); // konversi manual
    }
    return value;
  })
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const [day, month, year] = value.split('-').map(Number);
      return new Date(year, month - 1, day); // konversi manual
    }
    return value;
  })
  @IsDate()
  endDate: Date;

  @IsOptional()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  invoiceId: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;
}

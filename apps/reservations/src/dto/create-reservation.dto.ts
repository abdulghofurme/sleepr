import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { CreateChargeDto } from '@app/common';
import { Field, InputType } from '@nestjs/graphql';
import { DateFormatScalar } from '../scalars/date-format.scalar';

@InputType()
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
  @Field(() => DateFormatScalar)
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
  @Field(() => DateFormatScalar)
  endDate: Date;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  @Field(() => CreateChargeDto)
  charge: CreateChargeDto;
}

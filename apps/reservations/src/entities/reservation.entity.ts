import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Reservation {
  @Field()
  id: number;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  userId: number;

  @Field()
  invoiceId: string;
}

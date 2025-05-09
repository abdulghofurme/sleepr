import { User } from '@app/common/entities';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginUserResponseDto extends User {
  @Field()
  access_token: string;
}

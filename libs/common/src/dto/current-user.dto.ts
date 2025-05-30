import { Role } from '@app/common/entities/role.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CurrentUserDto {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field(() => [Role], { nullable: true })
  roles?: Role[];
}

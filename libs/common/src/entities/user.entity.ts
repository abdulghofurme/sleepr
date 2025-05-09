import { AbstractEntity } from '@app/common';
import { Role } from './role.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User extends AbstractEntity<User> {
  @Field()
  id: number;

  @Field()
  email: string;

  password: string;

  @Field(() => [Role], { nullable: true })
  roles?: Role[];
}

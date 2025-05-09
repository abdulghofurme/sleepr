import { Directive, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Directive('@shareable')
export class Role {
  @Field()
  id: number;

  @Field()
  name: string;
}

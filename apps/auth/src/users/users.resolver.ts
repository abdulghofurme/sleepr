import { User } from '@app/common/models';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CurrentUser, CurrentUserDto } from '@app/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // TODO: fix bug private query/mutation on @CurrentUser
  // @Query(() => User, { name: 'me' })
  // async getUser(@CurrentUser() user: CurrentUserDto) {
  //   console.log(user);
  //   return user;
  // }

  // TODO: fix bug private query/mutation on @CurrentUser
  // @Mutation(() => User)
  // async deleteMyAccount(@CurrentUser() user: CurrentUserDto) {
  //   return this.usersService.remove(user.id);
  // }
}

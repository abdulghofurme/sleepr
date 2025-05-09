import { User } from '@app/common/models';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CurrentUser, CurrentUserDto } from '@app/common';
import { UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../guards/jwt-auth.guard';
import { Logger } from 'nestjs-pino';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {}

  @Query(() => User, { name: 'me' })
  @UseGuards(JWTAuthGuard)
  async getUser(@CurrentUser() user: CurrentUserDto) {
    return user;
  }

  @Mutation(() => User)
  async deleteMyAccount(@CurrentUser() user: CurrentUserDto) {
    return this.usersService.remove(user.id);
  }
}

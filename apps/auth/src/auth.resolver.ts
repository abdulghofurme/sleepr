import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { User } from '@app/common/models';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import { LoginUserDto } from './users/dto/login-user.dto';
import { LoginUserResponseDto } from './users/dto/login-user-response.dto';
import { AuthService } from './auth.service';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Mutation(() => User)
  register(@Args('registerUserInput') registerUserInput: CreateUserDto) {
    return this.usersService.create(registerUserInput);
  }

  @Mutation(() => LoginUserResponseDto)
  login(@Args('loginUserInput') loginUserInput: LoginUserDto) {
    return this.authService.loginByCredentials(
      loginUserInput.email,
      loginUserInput.password,
    );
  }
}

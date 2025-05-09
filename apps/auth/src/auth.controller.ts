import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { Payload } from '@nestjs/microservices';
import {
  Authentication,
  AuthServiceController,
  AuthServiceControllerMethods,
  CurrentUser,
  CurrentUserDto,
  UserMessage,
} from '@app/common';
import { Logger } from 'nestjs-pino';
import { JWTAuthGuard } from './guards/jwt-auth.guard';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly logger: Logger,
  ) {}

  @Get('health-check')
  async healthCheck() {
    return { healhtCheck: true };
  }

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: CurrentUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(user, response);
  }

  @UseGuards(JWTAuthGuard)
  async authenticate(@Payload() data: Authentication & { user: UserMessage }) {
    return data.user;
  }
}

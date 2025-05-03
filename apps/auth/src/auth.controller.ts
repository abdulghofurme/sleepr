import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { MessagePattern } from '@nestjs/microservices';
import { JWTAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser, CurrentUserDto } from '@app/common';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
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

  @MessagePattern('authenticate')
  @UseGuards(JWTAuthGuard)
  async authenticate(@CurrentUser() user: CurrentUserDto) {
    return user;
  }
}

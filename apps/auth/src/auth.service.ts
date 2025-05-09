import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TTokenPayload } from './types/token-payload.type';
import { CurrentUserDto } from '@app/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(user: CurrentUserDto, response: Response) {
    const tokenPayload: TTokenPayload = {
      userId: user.id,
    };
    const token = this.jwtService.sign(tokenPayload);

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    response.cookie('Authentication', token, {
      expires,
      httpOnly: true,
      secure: true,
    });
    return {
      ...user,
      access_token: token,
    };
  }

  async loginByCredentials(email: string, password: string) {
    const user = await this.usersService.validateUser(email, password);
    const tokenPayload: TTokenPayload = {
      userId: user.id,
    };
    const token = this.jwtService.sign(tokenPayload);

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    return {
      ...user,
      access_token: token,
    };
  }
}

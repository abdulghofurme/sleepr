import { Injectable } from '@nestjs/common';
import { UserDocument } from './users/models/user.schema';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TTokenPayload } from './types/token-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: UserDocument, response: Response) {
    const tokenPayload: TTokenPayload = {
      userId: user._id.toHexString(),
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
    return user;
  }
}

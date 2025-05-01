import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users.service';
import { Request } from 'express';
import { TTokenPayload } from '../../types/token-payload.type';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
            console.log('COOKIE', request?.cookies?.Authentication)
            return request?.cookies?.Authentication
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: TTokenPayload) {
    console.log(userId, 'USER ID')
    const user = await this.usersService.getUser({ _id: userId });
    delete user.password;
    return user;
  }
}

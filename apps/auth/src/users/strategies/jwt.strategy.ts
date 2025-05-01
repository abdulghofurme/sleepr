import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users.service';
import { TTokenPayload } from '../../types/token-payload.type';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
            return request?.cookies?.Authentication || request?.Authentication
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

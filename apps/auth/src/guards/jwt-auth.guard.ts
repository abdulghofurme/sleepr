import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TTokenPayload } from '../types/token-payload.type';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from 'nestjs-pino';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request =
      context.getType().toString() === 'graphql'
        ? GqlExecutionContext.create(context).getContext().req
        : context.switchToHttp().getRequest();

    const token =
      request?.cookies?.Authentication ||
      request?.headers?.authentication ||
      request?.Authentication; // for not http connection

    this.logger.log(JSON.stringify(request.headers));
    this.logger.log(`Extracted Token in Guard: ${token}`);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decoded = this.jwtService.decode(token);
      const user = await this.validate(decoded as TTokenPayload);
      request.user = user;

      return true;
    } catch (error) {
      this.logger.log('Error can activate');
      throw new UnauthorizedException();
    }
  }

  async validate({ userId }: TTokenPayload) {
    try {
      const user = await this.usersService.getUser({ id: userId });
      if (!user) {
        this.logger.log('User tidak ditemukan');
        throw new UnauthorizedException();
      }
      return user;
    } catch (error) {
      this.logger.log('error usersService');
      throw new UnauthorizedException();
    }
  }
}

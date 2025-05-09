import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, map, Observable, tap } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '../types';
import { Logger } from 'nestjs-pino';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  private authService: AuthServiceClient;

  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly logger: Logger,
  ) {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isGraphql = context.getType().toString() === 'graphql';
    const request = isGraphql
      ? GqlExecutionContext.create(context).getContext().req
      : context.switchToHttp().getRequest();

    const token =
      request?.cookies?.Authentication ||
      request?.headers?.authentication ||
      request?.Authentication; // for not http connection

    if (!token) {
      throw new UnauthorizedException();
    }
    return this.authService
      .authenticate({
        Authentication: token,
      })
      .pipe(
        tap((res) => {
          if (isGraphql) {
            GqlExecutionContext.create(context).getContext().req.user = res;
          } else {
            context.switchToHttp().getRequest().user = res;
          }
        }),
        map(() => true),
        catchError((err) => {
          this.logger.log(err);

          throw new UnauthorizedException();
        }),
      );
  }
}

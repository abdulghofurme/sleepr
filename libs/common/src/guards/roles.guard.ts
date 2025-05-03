import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { catchError, filter, from, map, Observable, toArray } from 'rxjs';
import { CurrentUserDto } from '../dto';
import { Logger } from 'nestjs-pino';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly logger: Logger,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user: CurrentUserDto = request.user;

    // plain js
    // const isCanAccess = (user?.roles || [])?.some((role) =>
    //   requiredRoles.includes(role),
    // );

    // rxjs to readability & easy debug
    return from(user?.roles || []).pipe(
      filter((role) => requiredRoles.includes(role)),
      toArray(),
      map((collisions) => {
        if (collisions.length === 0) throw new UnauthorizedException();
        // this.logger.log(collisions) // check collision here
        return true;
      }),
      catchError(() => {
        throw new UnauthorizedException();
      }),
    );
  }
}

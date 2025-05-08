import { AUTH_SERVICE_NAME, AuthServiceClient } from '@app/common';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { catchError, map } from 'rxjs';

let authService: AuthServiceClient;

export const setAuthService = (app: INestApplication) => {
  const client = app.get<ClientGrpc>(AUTH_SERVICE_NAME);
  authService = client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
};

export const authContext = async ({ req }) => {
  try {
    console.log(authService);
    console.log('=================');
    return authService
      .authenticate({
        Authentication: req.headers?.authentication,
      })
      .pipe(
        map((res) => {
          console.log('======= USER ==========');
          console.log(res);
          console.log('=================');
          return { user: res };
        }),
        catchError((err) => {
          console.log(err, 'hueee');
          throw new UnauthorizedException();
        }),
      );
  } catch (err) {
    throw new UnauthorizedException(err);
  }
};

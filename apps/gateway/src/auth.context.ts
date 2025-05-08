import { AUTH_SERVICE_NAME, AuthServiceClient } from '@app/common';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

let appContext: INestApplication;

export const setAppContext = (app: INestApplication) => {
  appContext = app;
};

export const authContext = async ({ req }) => {
  try {
    const authService = appContext.get<AuthServiceClient>(AUTH_SERVICE_NAME);
    const user = await lastValueFrom(
      authService.authenticate({
        Authentication: req.headers?.authentication,
      }),
    );
    return { user };
  } catch (err) {
    throw new UnauthorizedException(err);
  }
};

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserDto } from '../dto';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUserDto => {
    if (context.getType() === 'http')
      return context.switchToHttp().getRequest().user;

    const user = context.getArgs()[2]?.req.headers.user;
    if (user) return JSON.parse(user);
  },
);

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CurrentUserDto } from '../dto';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUserDto => {
    try {
      if (context.getType().toString() === 'graphql') {
        return GqlExecutionContext.create(context).getContext().req.user;
      }

      return context.switchToHttp().getRequest().user;
    } catch (error) {
      console.log('ERROR', error);
    }
  },
);

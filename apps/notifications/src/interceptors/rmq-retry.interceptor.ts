import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { catchError, Observable, retry, throwError } from 'rxjs';

export class RmqRetryInteceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      retry(3), // retry 3 times
      catchError((err) => {
        // const ctx = context.switchToRpc().getContext<RmqContext>();
        // const channel = ctx.getChannelRef();
        // const message = ctx.getMessage();

        // channel.nack(message, false, false);
        return throwError(() => err);
      }),
    );
  }
}

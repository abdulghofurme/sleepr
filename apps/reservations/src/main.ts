import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule, {
    bufferLogs: true,
  });
  app.use(cookieParser());
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap();

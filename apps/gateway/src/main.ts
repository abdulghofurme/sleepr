import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { setAppContext } from './auth.context';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);
  setAppContext(app);
  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();

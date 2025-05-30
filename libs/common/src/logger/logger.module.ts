import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            translateTime: 'SYS:standard',
            colorize: true,
          },
        },
      },
    }),
  ],
  exports: [PinoLoggerModule], // Exporting to use in other modules
})
export class LoggerModule {}

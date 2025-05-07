import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@app/common';
import { z } from 'zod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsed = z.object({
          PORT: z.coerce.number(),
        }).safeParse(config)

        if (!parsed.success) {
          console.log('Config validation error: ', parsed.error.format())
          throw new Error('Invalid configuration')
        }

        return parsed.data
      }
    }),
    LoggerModule
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}

import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsed = z
          .object({
            SMTP_USER: z.string(),
            GOOGLE_OAUTH_CLIENT_ID: z.string(),
            GOOGLE_OAUTH_CLIENT_SECRET: z.string(),
            GOOGLE_OAUTH_REFRESH_TOKEN: z.string(),
            // handled by getOrThrow, but declare to document what config/env needed
            RABBITMQ_URI: z.string(),
          })
          .safeParse(config);

        if (!parsed.success) {
          console.log('Config validation error:', parsed.error.format());
          throw new Error('Invalid configuration');
        }

        return parsed.data;
      },
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}

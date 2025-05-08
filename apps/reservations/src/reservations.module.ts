import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  DatabaseModule,
  PAYMENTS_PACKAGE_NAME,
  PAYMENTS_SERVICE_NAME,
} from '@app/common';
import { Reservation } from './models/reservation.entity';
import { ReservationsRepository } from './reservations.repository';
import { LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { ReservationsResolver } from './reservations.resolver';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Reservation]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsed = z
          .object({
            PORT: z.coerce.number(),
            // handled by getOrThrow, but declare to document what config/env needed
            MYSQL_DATABASE: z.string(),
            MYSQL_USERNAME: z.string(),
            MYSQL_PASSWORD: z.string(),
            MYSQL_HOST: z.string(),
            MYSQL_PORT: z.coerce.number(),
            MYSQL_SYNCHRONIZE: z.coerce.boolean(),
            AUTH_GRPC_URL: z.string(), // client
            PAYMENTS_GRPC_URL: z.string(), // client
          })
          .safeParse(config);

        if (!parsed.success) {
          console.log('Config validation error:', parsed.error.format());
          throw new Error('Invalid configuration');
        }

        return parsed.data;
      },
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath: join(__dirname, '../../../proto/auth.proto'),
            url: configService.getOrThrow('AUTH_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: PAYMENTS_PACKAGE_NAME,
            protoPath: join(__dirname, '../../../proto/payments.proto'),
            url: configService.getOrThrow('PAYMENTS_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    ReservationsRepository,
    ReservationsResolver,
  ],
})
export class ReservationsModule {}

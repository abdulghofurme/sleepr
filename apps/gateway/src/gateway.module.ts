import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  LoggerModule,
} from '@app/common';
import { z } from 'zod';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsed = z
          .object({
            PORT: z.coerce.number(),
            RESERVATIONS_GRAPHQL_URL: z.string().url(),
            AUTH_GRPC_URL: z.string(), // client
          })
          .safeParse(config);

        if (!parsed.success) {
          console.log('Config validation error: ', parsed.error.format());
          throw new Error('Invalid configuration');
        }
        return parsed.data;
      },
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'reservations',
                url: configService.getOrThrow('RESERVATIONS_GRAPHQL_URL'),
              },
              {
                name: 'auth',
                url: configService.getOrThrow('AUTH_GRAPHQL_URL'),
              },
            ],
          }),
          buildService: ({ url }) =>
            new RemoteGraphQLDataSource({
              url,
              willSendRequest({ request, context }) {
                request.http.headers.set(
                  'authentication',
                  context?.req?.headers?.authentication,
                );
              },
            }),
        },
      }),
      inject: [ConfigService],
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
    ]),
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}

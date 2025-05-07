import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from '@app/common';
import { z } from 'zod';
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo'
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsed = z.object({
          PORT: z.coerce.number(),
          RESERVATIONS_GRAPHQL_URL: z.string().url()
        }).safeParse(config)

        if (!parsed.success) {
          console.log('Config validation error: ', parsed.error.format())
          throw new Error('Invalid configuration')
        }

        return parsed.data
      }
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: "reservations",
                url: configService.getOrThrow('RESERVATIONS_GRAPHQL_URL')
              }
            ]
          })
        }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule { }

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { LoggerModule } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { LocalStrategy } from './users/strategies/local.strategy';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { UsersResolver } from './users/users.resolver';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    UsersModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const parsed = z
          .object({
            HTTP_PORT: z.coerce.number(),
            JWT_SECRET: z.string(),
            JWT_EXPIRATION: z.coerce.number(),
            // handled by getOrThrow, but declare to document what config/env needed
            MYSQL_DATABASE: z.string(),
            MYSQL_USERNAME: z.string(),
            MYSQL_PASSWORD: z.string(),
            MYSQL_HOST: z.string(),
            MYSQL_PORT: z.coerce.number(),
            MYSQL_SYNCHRONIZE: z.coerce.boolean(),
            AUTH_GRPC_URL: z.string(),
          })
          .safeParse(config);

        if (!parsed.success) {
          console.log('Config validation error:', parsed.error.format());
          throw new Error('Invalid configuration');
        }

        return parsed.data;
      },
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UsersResolver, AuthResolver],
})
export class AuthModule {}
